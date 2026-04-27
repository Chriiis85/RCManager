import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface Attraction {
  id: number;
  name: string;
  park: string;
  country: string;
  type: string;
  manufacturer: string;
  openingYear: number;
  status: string;
  image: string;
  description: string;
}

@Component({
  selector: 'app-attractions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attractions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttractionsComponent implements OnInit {
  searchQuery = signal('');
  selectedCountries = signal<string[]>([]);
  selectedTypes = signal<string[]>([]);
  selectedManufacturers = signal<string[]>([]);
  selectedParks = signal<string[]>([]);
  
  isLoading = signal(true);
  showFilters = signal(false);

  showSuccessModal = signal(false);
  showLoginPromptModal = signal(false);
  authService = inject(AuthService);
  router = inject(Router);

  attractions = signal<Attraction[]>([]);

  visibleCount = signal(20);

  visibleAttractions = computed(() => {
    return this.filteredAttractions().slice(0, this.visibleCount());
  });

  loadMore() {
    this.visibleCount.update(c => c + 20);
  }

  ngOnInit() {
    this.fetchAttractions();
  }

  private fetchAttractions() {
    this.isLoading.set(true);
    fetch('https://rc-manager-api.vercel.app/api/attractions')
      .then(res => res.json())
      .then(data => {
        const mappedData: Attraction[] = data.map((a: any) => ({
          id: a.id,
          name: a.name,
          park: a.park?.name || 'Desconocido',
          country: a.park?.country || 'Desconocido',
          type: this.mapType(a.type),
          manufacturer: a.manufacturer || 'Desconocido',
          openingYear: a.openingYear || 0,
          status: this.mapStatus(a.status),
          image: a.imageUrl || `https://images.unsplash.com/photo-1513254222046-817812228834?auto=format&fit=crop&q=80&w=800&id=${a.id}`,
          description: `Disfruta de la emocionante atracción ${a.name} en ${a.park?.name}.`
        }));
        this.attractions.set(mappedData);
        this.isLoading.set(false);
      })
      .catch(err => {
        console.error('Error fetching attractions:', err);
        this.isLoading.set(false);
      });
  }

  private mapType(type: string): string {
    const types: Record<string, string> = {
      'WATER_RIDE': 'Acuática',
      'FLAT_RIDE': 'Flat Ride',
      'DARK_RIDE': 'Dark Ride',
      'OTHER': 'Otros',
      'ROLLER_COASTER': 'Montaña Rusa'
    };
    return types[type] || type;
  }

  private mapStatus(status: string): string {
    const statuses: Record<string, string> = {
      'OPERATING': 'Operativa',
      'SBNO': 'Cerrada Temporalmente',
      'REMOVED': 'Eliminada',
      'CONSTRUCTION': 'En Construcción'
    };
    return statuses[status] || status;
  }

  filteredAttractions = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const selCountries = this.selectedCountries();
    const selTypes = this.selectedTypes();
    const selManufacturers = this.selectedManufacturers();
    const selParks = this.selectedParks();

    return this.attractions().filter(a => {
      const matchesSearch = a.name.toLowerCase().includes(query) || 
                          a.park.toLowerCase().includes(query) ||
                          a.country.toLowerCase().includes(query);
      
      if (!matchesSearch) return false;

      if (selCountries.length > 0 && !selCountries.includes(a.country)) return false;
      if (selTypes.length > 0 && !selTypes.includes(a.type)) return false;
      if (selManufacturers.length > 0 && !selManufacturers.includes(a.manufacturer)) return false;
      if (selParks.length > 0 && !selParks.includes(a.park)) return false;

      return true;
    });
  });

  countries = computed(() => [...new Set(this.attractions().map(a => a.country))].sort());
  types = computed(() => [...new Set(this.attractions().map(a => a.type))].sort());
  manufacturers = computed(() => [...new Set(this.attractions().map(a => a.manufacturer))].sort());
  parks = computed(() => [...new Set(this.attractions().map(a => a.park))].sort());

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

  togglePark(name: string) {
    this.selectedParks.update(list => 
      list.includes(name) ? list.filter(i => i !== name) : [...list, name]
    );
    this.visibleCount.set(20);
  }

  clearAllFilters() {
    this.selectedCountries.set([]);
    this.selectedTypes.set([]);
    this.selectedManufacturers.set([]);
    this.selectedParks.set([]);
    this.searchQuery.set('');
    this.visibleCount.set(20);
  }

  handleAction(item: Attraction) {
    if (!this.authService.isAuthenticated()) {
      this.showLoginPromptModal.set(true);
    } else {
      this.showSuccessModal.set(true);
      setTimeout(() => {
        this.showSuccessModal.set(false);
      }, 3000);
    }
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
