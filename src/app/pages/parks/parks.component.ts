import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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
      image: 'https://images.unsplash.com/photo-1513889953293-4ad464ff1d79?auto=format&fit=crop&q=80&w=800',
      description: 'El resort más visitado de España, con 6 mundos fascinantes y PortAventura Park, Ferrari Land y Caribe Aquatic Park.',
      category: 'Resort'
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
      image: 'https://images.unsplash.com/photo-1603123853880-a92fafb7809f?auto=format&fit=crop&q=80&w=800',
      description: 'Conocido como la "Capital Mundial de las Montañas Rusas", situado en una península sobre el Lago Erie.',
      category: 'Temático'
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
      image: 'https://images.unsplash.com/photo-1513889953293-4ad464ff1d79?auto=format&fit=crop&q=80&w=800', // Placeholder
      description: 'Donde los sueños se hacen realidad. Dividido en Disneyland Park y Walt Disney Studios Park.',
      category: 'Resort'
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
      image: 'https://images.unsplash.com/photo-1544081031-64906dc9017f?auto=format&fit=crop&q=80&w=800',
      description: 'Famoso por su tematización inmersiva de clase mundial y atracciones récord.',
      category: 'Temático'
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
      image: 'https://images.unsplash.com/photo-1533230393124-7484ef92bb09?auto=format&fit=crop&q=80&w=800',
      description: 'El parque más grande de Alemania, con áreas dedicadas a diferentes países europeos.',
      category: 'Resort'
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
      image: 'https://images.unsplash.com/photo-1563811771046-ba984ff30900?auto=format&fit=crop&q=80&w=800',
      description: 'Un parque temático único construido alrededor de una mansión gótica y sus jardines históricos.',
      category: 'Temático'
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
