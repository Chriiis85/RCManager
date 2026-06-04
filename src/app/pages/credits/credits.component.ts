import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RecordsService } from '../../core/services/records.service';

interface Coaster {
  id: number;
  name: string;
  park: string;
  country: string;
  type: string;
  height: string;
  speed: string;
  length: string;
  image: string;
  manufacturer: string;
}

@Component({
  selector: 'app-credits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './credits.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditsComponent implements OnInit {
  searchQuery = signal('');
  showFilters = signal(false);
  
  selectedCountries = signal<string[]>([]);
  selectedParks = signal<string[]>([]);
  selectedTypes = signal<string[]>([]);
  selectedManufacturers = signal<string[]>([]);

  showSuccessModal = signal(false);
  showLoginPromptModal = signal(false);
  isLoading = signal(true);
  authService = inject(AuthService);
  recordsService = inject(RecordsService);
  router = inject(Router);

  coasters = signal<Coaster[]>([]);
  userCredits = signal<Set<number>>(new Set());

  visibleCount = signal(20);

  visibleCoasters = computed(() => {
    return this.filteredCoasters().slice(0, this.visibleCount());
  });

  loadMore() {
    this.visibleCount.update(c => c + 20);
  }

  ngOnInit() {
    this.fetchCoasters();
    if (this.authService.isAuthenticated()) {
      this.fetchUserCredits();
    }
  }

  async fetchUserCredits() {
    this.recordsService.getCredits().subscribe({
      next: (credits) => {
        // Store both the local DB id and the apiId so we can match external IDs
        const creditIds = new Set<number>();
        credits.forEach(c => {
          creditIds.add(c.coasterId);
          if (c.coaster?.apiId) creditIds.add(c.coaster.apiId);
        });
        this.userCredits.set(creditIds);
      },
      error: (err) => console.error('Error fetching user credits:', err)
    });
  }

  async fetchCoasters() {
    this.isLoading.set(true);
    try {
      const response = await fetch('https://rc-manager-api.vercel.app/api/coasters');
      const data = await response.json();
      
      const mappedCoasters: Coaster[] = data.map((c: any) => ({
        id: c.id,
        name: c.name,
        park: c.park?.name || 'Desconocido',
        country: c.park?.country || 'Desconocido',
        type: c.model || 'N/A',
        height: c.height ? `${c.height}m` : 'N/A',
        speed: c.speed ? `${c.speed} km/h` : 'N/A',
        length: c.length ? `${c.length}m` : 'N/A',
        image: c.imageUrl || `https://images.unsplash.com/photo-1513413173474-29c9161a04d3?auto=format&fit=crop&q=80&w=800&q=80&id=${c.id}`,
        manufacturer: c.manufacturer || 'Desconocido'
      }));

      this.coasters.set(mappedCoasters);
    } catch (error) {
      console.error('Error fetching coasters:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  handleAction(item: Coaster) {
    if (!this.authService.isAuthenticated()) {
      this.showLoginPromptModal.set(true);
      return;
    }

    const hasCredit = this.userCredits().has(item.id);

    if (hasCredit) {
      this.recordsService.removeCredit(item.id).subscribe({
        next: () => {
          this.userCredits.update(set => {
            const newSet = new Set(set);
            newSet.delete(item.id);
            return newSet;
          });
        },
        error: (err) => console.error('Error al eliminar credit', err)
      });
    } else {
      this.recordsService.addCredit(item.id, undefined, undefined, undefined, {
          name: item.name,
          park: item.park,
          country: item.country,
          manufacturer: item.manufacturer
        }).subscribe({
        next: () => {
          this.userCredits.update(set => {
            const newSet = new Set(set);
            newSet.add(item.id);
            return newSet;
          });
          this.showSuccessModal.set(true);
          setTimeout(() => {
            this.showSuccessModal.set(false);
          }, 3000);
        },
        error: (err) => console.error('Error al añadir credit', err)
      });
    }
  }

  filteredCoasters = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const selCountries = this.selectedCountries();
    const selParks = this.selectedParks();
    const selTypes = this.selectedTypes();
    const selManufacturers = this.selectedManufacturers();

    return this.coasters().filter(c => {
      // 1. Search Query
      const matchesSearch = c.name.toLowerCase().includes(query) ||
        c.park.toLowerCase().includes(query) ||
        c.country.toLowerCase().includes(query) ||
        c.manufacturer.toLowerCase().includes(query);
      if (!matchesSearch) return false;

      // 2. Multi-select Filters
      if (selCountries.length > 0 && !selCountries.includes(c.country)) return false;
      if (selParks.length > 0 && !selParks.includes(c.park)) return false;
      if (selTypes.length > 0 && !selTypes.includes(c.type)) return false;
      if (selManufacturers.length > 0 && !selManufacturers.includes(c.manufacturer)) return false;

      return true;
    });
  });

  countries = computed(() => {
    const all = this.coasters().map(c => c.country);
    return [...new Set(all)].sort();
  });

  parks = computed(() => {
    const all = this.coasters().map(c => c.park);
    return [...new Set(all)].sort();
  });

  types = computed(() => {
    const all = this.coasters().map(c => c.type);
    return [...new Set(all)].sort();
  });

  manufacturers = computed(() => {
    const all = this.coasters().map(c => c.manufacturer);
    return [...new Set(all)].sort();
  });

  updateSearch(query: string) {
    this.searchQuery.set(query);
    this.visibleCount.set(20);
  }

  toggleCountry(name: string) {
    this.selectedCountries.update(list => 
      list.includes(name) ? list.filter(i => i !== name) : [...list, name]
    );
    this.visibleCount.set(20);
  }

  togglePark(name: string) {
    this.selectedParks.update(list => 
      list.includes(name) ? list.filter(i => i !== name) : [...list, name]
    );
    this.visibleCount.set(20);
  }

  toggleType(name: string) {
    this.selectedTypes.update(list => 
      list.includes(name) ? list.filter(i => i !== name) : [...list, name]
    );
    this.visibleCount.set(20);
  }

  toggleManufacturer(name: string) {
    this.selectedManufacturers.update(list => 
      list.includes(name) ? list.filter(i => i !== name) : [...list, name]
    );
    this.visibleCount.set(20);
  }

  clearAllFilters() {
    this.selectedCountries.set([]);
    this.selectedParks.set([]);
    this.selectedTypes.set([]);
    this.selectedManufacturers.set([]);
    this.searchQuery.set('');
    this.visibleCount.set(20);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.showFilters()) return;
    const target = event.target as HTMLElement;
    if (!target.closest('.filter-toggle-btn') && !target.closest('.filter-panel')) {
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
