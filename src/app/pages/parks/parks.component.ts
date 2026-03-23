import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
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
export class ParksComponent {
  searchQuery = signal('');
  selectedCategory = signal('all');

  showSuccessModal = signal(false);
  showLoginPromptModal = signal(false);
  authService = inject(AuthService);
  router = inject(Router);

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

  parks = signal<ThemePark[]>([
    {
      id: 1,
      name: 'PortAventura World',
      location: 'Salou, Tarragona',
      country: 'España',
      opened: 1995,
      coasters: 9,
      attractions: 43,
      shows: 15,
      image: 'https://images.unsplash.com/photo-1547675960-7634cf1b0856?auto=format&fit=crop&q=80&w=800',
      description: 'El resort más visitado de España, con 6 mundos fascinantes y PortAventura Park, Ferrari Land y Caribe Aquatic Park.',
      category: 'Resort',
      status: 'Abierto',
      crowds: 'Alta'
    },
    {
      id: 2,
      name: 'Cedar Point',
      location: 'Sandusky, Ohio',
      country: 'USA',
      opened: 1870,
      coasters: 18,
      attractions: 71,
      shows: 10,
      image: 'https://images.unsplash.com/photo-1600229783609-26c4ebb3fb49?auto=format&fit=crop&q=80&w=800',
      description: 'Conocido como la "Capital Mundial de las Montañas Rusas", situado en una península sobre el Lago Erie.',
      category: 'Temático',
      status: 'Cerrado',
      crowds: 'Baja'
    },
    {
      id: 3,
      name: 'Disneyland Paris',
      location: 'Marne-la-Vallée',
      country: 'Francia',
      opened: 1992,
      coasters: 7,
      attractions: 54,
      shows: 12,
      image: 'https://images.unsplash.com/photo-1605443791607-80a259dd3c3c?auto=format&fit=crop&q=80&w=800',
      description: 'Donde los sueños se hacen realidad. Dividido en Disneyland Park y Walt Disney Studios Park.',
      category: 'Resort',
      status: 'Abierto',
      crowds: 'Media'
    },
    {
      id: 4,
      name: 'Phantasialand',
      location: 'Brühl',
      country: 'Alemania',
      opened: 1967,
      coasters: 8,
      attractions: 38,
      shows: 8,
      image: 'https://images.unsplash.com/photo-1769713727279-ee0eeee2efcf?auto=format&fit=crop&q=80&w=800',
      description: 'Famoso por su tematización inmersiva de clase mundial y atracciones récord.',
      category: 'Temático',
      status: 'Abierto',
      crowds: 'Alta'
    },
    {
      id: 5,
      name: 'Europa-Park',
      location: 'Rust',
      country: 'Alemania',
      opened: 1975,
      coasters: 14,
      attractions: 100,
      shows: 23,
      image: 'https://images.unsplash.com/photo-1719640502390-5c6e85176ea9?auto=format&fit=crop&q=80&w=800',
      description: 'El parque más grande de Alemania, con áreas dedicadas a diferentes países europeos.',
      category: 'Resort',
      status: 'Abierto',
      crowds: 'Media'
    },
    {
      id: 6,
      name: 'Alton Towers',
      location: 'Staffordshire',
      country: 'UK',
      opened: 1980,
      coasters: 10,
      attractions: 40,
      shows: 6,
      image: 'https://images.unsplash.com/photo-1628835788312-41d61f5ddce8?auto=format&fit=crop&q=80&w=800',
      description: 'Un parque temático único construido alrededor de una mansión gótica y sus jardines históricos.',
      category: 'Temático',
      status: 'Cerrado',
      crowds: 'Baja'
    }
  ]);

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
