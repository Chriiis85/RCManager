import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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
export class CreditsComponent {
  searchQuery = signal('');
  selectedFilter = signal('all');

  coasters = signal<Coaster[]>([
    {
      id: 1,
      name: 'Shambhala',
      park: 'PortAventura Park',
      country: 'España',
      type: 'Hyper Coaster',
      height: '76m',
      speed: '134 km/h',
      length: '1,564m',
      image: 'https://images.unsplash.com/photo-1773430647628-05fca7d2bd13?auto=format&fit=crop&q=80&w=800',
      manufacturer: 'Bolliger & Mabillard'
    },
    {
      id: 2,
      name: 'Steel Vengeance',
      park: 'Cedar Point',
      country: 'USA',
      type: 'Hybrid Coaster',
      height: '62m',
      speed: '119 km/h',
      length: '1,750m',
      image: 'https://images.unsplash.com/photo-1465996140498-df84be101126?auto=format&fit=crop&q=80&w=800',
      manufacturer: 'Rocky Mountain Construction'
    },
    {
      id: 3,
      name: 'Red Force',
      park: 'Ferrari Land',
      country: 'España',
      type: 'Giga Coaster',
      height: '112m',
      speed: '180 km/h',
      length: '880m',
      image: 'https://images.unsplash.com/photo-1567201372773-7a1b5c67604d?auto=format&fit=crop&q=80&w=800',
      manufacturer: 'Intamin'
    },
    {
      id: 4,
      name: 'Taron',
      park: 'Phantasialand',
      country: 'Alemania',
      type: 'Multi Launch',
      height: '30m',
      speed: '117 km/h',
      length: '1,320m',
      image: 'https://images.unsplash.com/photo-1769713727279-ee0eeee2efcf?auto=format&fit=crop&q=80&w=800',
      manufacturer: 'Intamin'
    },
    {
      id: 5,
      name: 'Fury 325',
      park: 'Carowinds',
      country: 'USA',
      type: 'Giga Coaster',
      height: '99m',
      speed: '153 km/h',
      length: '2,012m',
      image: 'https://images.unsplash.com/photo-1533230393124-7484ef92bb09?auto=format&fit=crop&q=80&w=800',
      manufacturer: 'Bolliger & Mabillard'
    },
    {
      id: 6,
      name: 'The Ride to Happiness',
      park: 'Plopsaland De Panne',
      country: 'Bélgica',
      type: 'Extreme Spinning',
      height: '33m',
      speed: '95 km/h',
      length: '920m',
      image: 'https://images.unsplash.com/photo-1628835788312-41d61f5ddce8?auto=format&fit=crop&q=80&w=800',
      manufacturer: 'Mack Rides'
    }
  ]);

  filteredCoasters = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const filter = this.selectedFilter();
    
    return this.coasters().filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(query) || 
                          c.park.toLowerCase().includes(query) ||
                          c.country.toLowerCase().includes(query);
      
      const matchesFilter = filter === 'all' || c.country === filter;
      
      return matchesSearch && matchesFilter;
    });
  });

  countries = computed(() => {
    const allCountries = this.coasters().map(c => c.country);
    return ['all', ...new Set(allCountries)];
  });

  updateSearch(query: string) {
    this.searchQuery.set(query);
  }

  updateFilter(filter: string) {
    this.selectedFilter.set(filter);
  }
}
