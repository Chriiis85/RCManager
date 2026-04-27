import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface ThemePark {
  id: number;
  name: string;
  location: string;
  country: string;
  opened: number;
  coasters: number;
  attractions: number;
  shows: number;
  image: string;
  description: string;
  category: 'Resort' | 'Temático' | 'Acuático';
  status: 'Abierto' | 'Cerrado';
  crowds: 'Muy Baja' | 'Baja' | 'Normal' | 'Alta' | 'Muy Alta';
  hasTodayData?: boolean;
}

@Component({
  selector: 'app-parks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './parks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParksComponent implements OnInit {
  @ViewChild('rideListContainer') rideListContainer!: ElementRef;
  searchQuery = signal('');
  selectedCountries = signal<string[]>([]);
  selectedStatuses = signal<string[]>([]); // 'Abierto', 'Cerrado', 'Sin Datos'
  selectedCrowds = signal<string[]>([]);
  visibleParksLimit = signal(15);
  showFilters = signal(false);

  showSuccessModal = signal(false);
  showLoginPromptModal = signal(false);
  authService = inject(AuthService);
  router = inject(Router);

  // Estados para el detalle del parque
  selectedPark = signal<ThemePark | null>(null);
  parkQueueTimes = signal<any | null>(null);
  rideSearchQuery = signal('');
  rideSortOrder = signal<'asc' | 'desc'>('desc');
  isLoadingQueue = signal(false);
  isInitialLoading = signal(true);

  sortedRides = computed(() => {
    const data = this.parkQueueTimes();
    if (!data) return [];

    const query = this.rideSearchQuery().toLowerCase();
    const order = this.rideSortOrder();

    // Extraemos todas las atracciones (de la raíz y de las 'lands')
    let allRides: any[] = [];
    if (data.rides) {
      allRides = [...data.rides];
    }
    if (data.lands) {
      data.lands.forEach((land: any) => {
        if (land.rides) {
          const landRides = land.rides.map((r: any) => ({
            ...r,
            landName: land.name,
          }));
          allRides = [...allRides, ...landRides];
        }
      });
    }

    // Filtramos por búsqueda
    const filtered = allRides.filter(
      (r) =>
        r.name.toLowerCase().includes(query) ||
        (r.landName && r.landName.toLowerCase().includes(query)),
    );

    // Ordenamos: Abiertas primero + Mayor/Menor tiempo de espera
    return filtered.sort((a, b) => {
      // 1. Si uno está abierto y el otro no, el abierto va primero
      if (a.is_open && !b.is_open) return -1;
      if (!a.is_open && b.is_open) return 1;

      // 2. Si ambos tienen el mismo estado, ordenamos según 'order'
      return order === 'desc' ? b.wait_time - a.wait_time : a.wait_time - b.wait_time;
    });
  });

  ngOnInit() {
    // 1. Petición para conseguir todos los parques
    fetch('/queue-times-api/parks.json', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((groups) => {
        const allParks = groups.flatMap((group: any) => group.parks);
        console.log('[Queue-Times API] Grupos:', groups.length);

        const mappedParks: ThemePark[] = allParks.map((p: any) => ({
          id: p.id,
          name: p.name,
          location: p.country || 'Resort', // Usamos el país como ubicación temporal
          country: p.country || 'Desconocido',
          opened: 0,
          coasters: 0,
          attractions: 0,
          shows: 0,
          image: `https://images.unsplash.com/photo-1547675960-7634cf1b0856?auto=format&fit=crop&q=80&w=800&id=${p.id}`, // Evitamos caché con el ID
          description: `Disfruta de la mejor experiencia en ${p.name}.`,
          category: 'Temático' as const,
          status: 'Abierto' as const, // Estado inicial
          crowds: 'Normal' as const,
        }));

        this.parks.set(mappedParks);

        // Actualizamos los estados dinámicamente en lotes
        this.updateAllParkStatuses(mappedParks).finally(() => {
          this.isInitialLoading.set(false);
        });
      })
      .catch((err) => {
        console.error(err);
        this.isInitialLoading.set(false);
      });
  }

  private async updateAllParkStatuses(mappedParks: ThemePark[]) {
    // Procesamos en lotes de 15 para velocidad sin bloquear peticiones
    const batchSize = 15;
    for (let i = 0; i < mappedParks.length; i += batchSize) {
      const batch = mappedParks.slice(i, i + batchSize);
      await Promise.all(batch.map((park) => this.checkAndUpdateStatus(park)));
    }
  }

  private async checkAndUpdateStatus(park: ThemePark) {
    try {
      const res = await fetch(`/queue-times-api/parks/${park.id}/queue_times.json`);
      if (!res.ok) return;

      const data = await res.json();
      const allRides: any[] = [];

      if (data.rides) allRides.push(...data.rides);
      if (data.lands) {
        data.lands.forEach((land: any) => {
          if (land.rides) allRides.push(...land.rides);
        });
      }

      if (allRides.length === 0) {
        return;
      }

      // Comprobar si los datos son de HOY (2026-03-25)
      const today = new Date().toISOString().split('T')[0];
      const hasFreshData = allRides.some((r) => r.last_updated && r.last_updated.startsWith(today));

      if (!hasFreshData) {
        return; // No marcamos como que tiene datos de hoy
      }

      // Lógica solicitada: Cerrado si todas están cerradas O todas a cero
      const allClosed = allRides.every((r) => r.is_open === false);
      const allZeroWait = allRides.every((r) => r.wait_time === 0 || r.wait_time === null);

      const newStatus: 'Abierto' | 'Cerrado' = allClosed || allZeroWait ? 'Cerrado' : 'Abierto';

      // Lógica avanzada para crowds: basada en presión total (Total Wait / Total Rides)
      let newCrowds: 'Muy Baja' | 'Baja' | 'Normal' | 'Alta' | 'Muy Alta' = 'Baja';
      const totalRides = allRides.length;
      if (totalRides > 0) {
        const totalWait = allRides.reduce((acc, r) => acc + (r.wait_time || 0), 0);
        const crowdIndex = totalWait / totalRides;

        if (crowdIndex > 50) newCrowds = 'Muy Alta';
        else if (crowdIndex > 30) newCrowds = 'Alta';
        else if (crowdIndex > 15) newCrowds = 'Normal';
        else if (crowdIndex > 5) newCrowds = 'Baja';
        else newCrowds = 'Muy Baja';
      }

      this.parks.update((parks) =>
        parks.map((p) =>
          p.id === park.id ? { ...p, status: newStatus, crowds: newCrowds, hasTodayData: true } : p,
        ),
      );
    } catch (error) {
      // Ignorar errores individuales
    }
  }

  showParkDetails(park: ThemePark) {
    this.selectedPark.set(park);
    this.isLoadingQueue.set(true);
    this.parkQueueTimes.set(null);

    fetch(`/queue-times-api/parks/${park.id}/queue_times.json`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(`[Queue-Times API] Tiempos de ${park.name}:`, data);
        this.parkQueueTimes.set(data);
        this.isLoadingQueue.set(false);

        // También actualizamos el estado del parque en la lista principal
        const allRides: any[] = [];
        if (data.rides) allRides.push(...data.rides);
        if (data.lands) {
          data.lands.forEach((land: any) => {
            if (land.rides) allRides.push(...land.rides);
          });
        }
        if (allRides.length > 0) {
          const allClosed = allRides.every((r: any) => r.is_open === false);
          const allZeroWait = allRides.every((r: any) => r.wait_time === 0 || r.wait_time === null);
          const newStatus: 'Abierto' | 'Cerrado' = allClosed || allZeroWait ? 'Cerrado' : 'Abierto';

          this.parks.update((parks) =>
            parks.map((p) => (p.id === park.id ? { ...p, status: newStatus } : p)),
          );
        }
      })
      .catch((err) => {
        console.error('Error cargando tiempos:', err);
        this.isLoadingQueue.set(false);
      });
  }

  closeParkDetails() {
    this.selectedPark.set(null);
    this.parkQueueTimes.set(null);
    this.rideSearchQuery.set('');
    this.rideSortOrder.set('desc');
  }

  updateRideSearch(query: string) {
    this.rideSearchQuery.set(query);
  }

  toggleRideSort() {
    this.rideSortOrder.set(this.rideSortOrder() === 'desc' ? 'asc' : 'desc');

    // Scroll to top of the list
    if (this.rideListContainer) {
      this.rideListContainer.nativeElement.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }

  handleAction(item: ThemePark) {
    if (!this.authService.isAuthenticated()) {
      this.showLoginPromptModal.set(true);
    } else {
      this.showSuccessModal.set(true);
      setTimeout(() => {
        this.showSuccessModal.set(false);
      }, 3000);
    }
  }

  parks = signal<ThemePark[]>([]);

  filteredParks = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const selCountries = this.selectedCountries();
    const selStatuses = this.selectedStatuses();
    const selCrowds = this.selectedCrowds();

    return this.parks()
      .filter((p) => {
        // 1. Búsqueda por texto
        const matchesSearch =
          p.name.toLowerCase().includes(query) ||
          p.location.toLowerCase().includes(query) ||
          p.country.toLowerCase().includes(query);
        if (!matchesSearch) return false;

        // 2. Filtro de País
        if (selCountries.length > 0 && !selCountries.includes(p.country)) return false;

        // 3. Filtro de Estado
        if (selStatuses.length > 0) {
          const pStatus = p.hasTodayData ? p.status : 'Sin Datos';
          if (!selStatuses.includes(pStatus)) return false;
        } else {
          // Si no hay filtro de estado, por defecto mostramos solo los que tienen hoy data (comportamiento actual)
          // unless the user adds "Sin Datos"
          if (!p.hasTodayData && selStatuses.length === 0) return false;
        }

        // 4. Filtro de Afluencia
        if (selCrowds.length > 0 && p.hasTodayData && !selCrowds.includes(p.crowds)) return false;

        return true;
      })
      .sort((a, b) => {
        // 1. Estado: Abierto (primero) > Cerrado (después)
        if (a.status === 'Abierto' && b.status === 'Cerrado') return -1;
        if (a.status === 'Cerrado' && b.status === 'Abierto') return 1;

        // 2. Alfabético (secundario)
        return a.name.localeCompare(b.name);
      })
      .slice(0, this.visibleParksLimit());
  });

  hasMoreParks = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const selCountries = this.selectedCountries();
    const selStatuses = this.selectedStatuses();
    const selCrowds = this.selectedCrowds();

    const totalFilteredCount = this.parks().filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.country.toLowerCase().includes(query);
      if (!matchesSearch) return false;
      if (selCountries.length > 0 && !selCountries.includes(p.country)) return false;
      if (selStatuses.length > 0) {
        const pStatus = p.hasTodayData ? p.status : 'Sin Datos';
        if (!selStatuses.includes(pStatus)) return false;
      } else {
        if (!p.hasTodayData) return false;
      }
      if (selCrowds.length > 0 && p.hasTodayData && !selCrowds.includes(p.crowds)) return false;
      return true;
    }).length;

    return totalFilteredCount > this.visibleParksLimit();
  });

  loadMore() {
    this.visibleParksLimit.update((limit) => limit + 12);
  }

  countries = computed(() => {
    const allC = this.parks().map((p) => p.country);
    return [...new Set(allC)].sort();
  });

  updateSearch(query: string) {
    this.searchQuery.set(query);
    this.visibleParksLimit.set(15);
  }

  toggleCountry(country: string) {
    this.selectedCountries.update((list) =>
      list.includes(country) ? list.filter((c) => c !== country) : [...list, country],
    );
    this.visibleParksLimit.set(15);
  }

  toggleStatus(status: string) {
    this.selectedStatuses.update((list) =>
      list.includes(status) ? list.filter((s) => s !== status) : [...list, status],
    );
    this.visibleParksLimit.set(15);
  }

  toggleCrowd(crowd: string) {
    this.selectedCrowds.update((list) =>
      list.includes(crowd) ? list.filter((c) => c !== crowd) : [...list, crowd],
    );
    this.visibleParksLimit.set(15);
  }

  clearAllFilters() {
    this.selectedCountries.set([]);
    this.selectedStatuses.set([]);
    this.selectedCrowds.set([]);
    this.searchQuery.set('');
    this.visibleParksLimit.set(15);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.showFilters()) return;

    const target = event.target as HTMLElement;
    // Buscamos si el click fue dentro del botón o del panel
    const isFilterButton = target.closest('.filter-toggle-btn');
    const isFilterPanel = target.closest('.filter-panel');

    if (!isFilterButton && !isFilterPanel) {
      this.showFilters.set(false);
    }
  }

  showScrollTop = signal(false);

  @HostListener('window:scroll')
  onWindowScroll() {
    this.showScrollTop.set(window.scrollY > 400);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
