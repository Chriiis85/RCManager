import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  crowds: 'Baja' | 'Media' | 'Alta';
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
  selectedCategory = signal('all');

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
            landName: land.name
          }));
          allRides = [...allRides, ...landRides];
        }
      });
    }

    // Filtramos por búsqueda
    const filtered = allRides.filter(r => 
      r.name.toLowerCase().includes(query) || 
      (r.landName && r.landName.toLowerCase().includes(query))
    );

    // Ordenamos: Abiertas primero + Mayor/Menor tiempo de espera
    return filtered.sort((a, b) => {
      // 1. Si uno está abierto y el otro no, el abierto va primero
      if (a.is_open && !b.is_open) return -1;
      if (!a.is_open && b.is_open) return 1;
      
      // 2. Si ambos tienen el mismo estado, ordenamos según 'order'
      return order === 'desc' 
        ? b.wait_time - a.wait_time 
        : a.wait_time - b.wait_time;
    });
  });

  ngOnInit() {
    // 1. Petición para conseguir todos los parques
    fetch('/queue-times-api/parks.json', {
      method: 'GET'
    })
      .then(res => res.json())
      .then(groups => {
        const allParks = groups.flatMap((group: any) => group.parks);
        console.log('[Queue-Times API] Grupos:', groups.length);
        console.log('[Queue-Times API] Total Parques:', allParks.length);
        console.log('[Queue-Times API] Lista Completa:', allParks);
        if (allParks.length > 0) {
          console.log('[Queue-Times API] Ejemplo de un parque por dentro:', allParks[0]);
        }

        const mappedParks = allParks.map((p: any) => ({
          id: p.id,
          name: p.name,
          location: 'PRUEBA',
          country: p.country || 'PRUEBA',
          opened: 0,
          coasters: 0,
          attractions: 0,
          shows: 0,
          image: 'https://images.unsplash.com/photo-1547675960-7634cf1b0856?auto=format&fit=crop&q=80&w=800',
          description: 'PRUEBA',
          category: 'Temático' as const,
          status: 'Abierto' as const,
          crowds: 'Media' as const
        }));

        this.parks.set(mappedParks);
      })
      .catch(console.error);

    // 2. Petición para conseguir los tiempos de espera de un parque específico (ej. Thorpe Park, ID 2)
    fetch('/queue-times-api/parks/2/queue_times.json', {
      method: 'GET'
    })
      .then(res => res.json())
      .then(data => {
        console.log('[Queue-Times API] Tiempos de espera de Thorpe Park (ID 2):', data);
      })
      .catch(console.error);
  }

  showParkDetails(park: ThemePark) {
    this.selectedPark.set(park);
    this.isLoadingQueue.set(true);
    this.parkQueueTimes.set(null);

    fetch(`/queue-times-api/parks/${park.id}/queue_times.json`, {
      method: 'GET'
    })
      .then(res => res.json())
      .then(data => {
        console.log(`[Queue-Times API] Tiempos de ${park.name}:`, data);
        this.parkQueueTimes.set(data);
        this.isLoadingQueue.set(false);
      })
      .catch(err => {
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
        behavior: 'smooth'
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
    const cat = this.selectedCategory();

    return this.parks().filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.country.toLowerCase().includes(query);

      const matchesCategory = cat === 'all' || p.category === cat;

      return matchesSearch && matchesCategory;
    });
  });

  categories = computed(() => {
    const allCats = this.parks().map(p => p.category);
    return ['all', ...new Set(allCats)];
  });

  updateSearch(query: string) {
    this.searchQuery.set(query);
  }

  updateCategory(cat: string) {
    this.selectedCategory.set(cat);
  }
}
