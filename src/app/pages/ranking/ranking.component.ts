import { Component, ChangeDetectionStrategy, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MAPPED_THEME_PARKS } from './theme-parks-data';

interface RankingItem {
  id: number | string;
  position: number;
  name: string;
  subtitle: string;
  park?: string;
  image: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  tipo?: string;
  gestor?: string;
}

interface RankingCategory {
  id: string;
  name: string;
  icon: string;
  items: RankingItem[];
}

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ranking.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RankingComponent {
  activeCategoryId = signal<string>('theme_parks');

  categories = signal<RankingCategory[]>([
    {
      id: 'theme_parks',
      name: 'Mejor Parque Temático',
      icon: '🎡',
      items: MAPPED_THEME_PARKS
    },
    {
      id: 'water_parks',
      name: 'Mejor Parque Acuático',
      icon: '💦',
      items: [
        { id: 40, position: 1, name: 'Siam Park', subtitle: 'Tenerife, España', image: 'https://images.unsplash.com/photo-1582239634584-18e4c76b1585?auto=format&fit=crop&q=80&w=800', score: 9.9, trend: 'stable' },
        { id: 41, position: 2, name: 'Volcano Bay', subtitle: 'Florida, USA', image: 'https://images.unsplash.com/photo-1588665798951-4091a9235cb3?auto=format&fit=crop&q=80&w=800', score: 9.6, trend: 'up' }
      ]
    },
    {
      id: 'coasters',
      name: 'Mejor Montaña Rusa',
      icon: '🎢',
      items: [
        { id: 10, position: 1, name: 'Steel Vengeance', park: 'Cedar Point', subtitle: 'RMC Hybrid', image: 'https://images.unsplash.com/photo-1465996140498-df84be101126?auto=format&fit=crop&q=80&w=800', score: 9.9, trend: 'stable' },
        { id: 11, position: 2, name: 'VelociCoaster', park: 'Islands of Adventure', subtitle: 'Intamin Launch', image: 'https://images.unsplash.com/photo-1506477331477-33d3184f4543?auto=format&fit=crop&q=80&w=800', score: 9.8, trend: 'up' },
        { id: 12, position: 3, name: 'Fury 325', park: 'Carowinds', subtitle: 'B&M Giga', image: 'https://images.unsplash.com/photo-1533230393124-7484ef92bb09?auto=format&fit=crop&q=80&w=800', score: 9.7, trend: 'stable' },
        { id: 13, position: 4, name: 'Taron', park: 'Phantasialand', subtitle: 'Intamin Multi-launch', image: 'https://images.unsplash.com/photo-1769713727279-ee0eeee2efcf?auto=format&fit=crop&q=80&w=800', score: 9.6, trend: 'up' },
        { id: 14, position: 5, name: 'Hyperia', park: 'Thorpe Park', subtitle: 'Mack Hyper', image: 'https://images.unsplash.com/photo-1563293750-2d88697b919d?auto=format&fit=crop&q=80&w=800', score: 9.5, trend: 'up' }
      ]
    },
    {
      id: 'attractions',
      name: 'Mejores Atracciones',
      icon: '🎠',
      items: [
        { id: 50, position: 1, name: 'Rise of the Resistance', park: 'Disney\'s Hollywood Studios', subtitle: 'Trackless Dark Ride', image: 'https://images.unsplash.com/photo-1605443791607-80a259dd3c3c?auto=format&fit=crop&q=80&w=800', score: 9.9, trend: 'stable' },
        { id: 51, position: 2, name: 'Avatar Flight of Passage', park: 'Disney\'s Animal Kingdom', subtitle: 'Flying Theater', image: 'https://images.unsplash.com/photo-1620005001234-a123e98cc56a?auto=format&fit=crop&q=80&w=800', score: 9.7, trend: 'stable' }
      ]
    },
    {
      id: 'water_rides',
      name: 'Mejores Atracciones Acuáticas',
      icon: '🌊',
      items: [
        { id: 20, position: 1, name: 'Chiapas', park: 'Phantasialand', subtitle: 'Log Flume', image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=800', score: 9.8, trend: 'stable' },
        { id: 21, position: 2, name: 'Tutuki Splash', park: 'PortAventura', subtitle: 'Shoot-the-Chutes', image: 'https://images.unsplash.com/photo-1473216891040-2057398b1897?auto=format&fit=crop&q=80&w=800', score: 9.4, trend: 'stable' },
        { id: 22, position: 3, name: 'Jurassic Park', park: 'Universal Studios', subtitle: 'Water Ride', image: 'https://images.unsplash.com/photo-1620005001234-a123e98cc56a?auto=format&fit=crop&q=80&w=800', score: 9.2, trend: 'down' }
      ]
    },
    {
      id: 'shows',
      name: 'Mejores Shows',
      icon: '🎭',
      items: [
        { id: 30, position: 1, name: 'Disney Dreams!', park: 'Disneyland Paris', subtitle: 'Firework / Mapping', image: 'https://images.unsplash.com/photo-1605443791607-80a259dd3c3c?auto=format&fit=crop&q=80&w=800', score: 9.8, trend: 'up' },
        { id: 31, position: 2, name: 'Raveleijn', park: 'Efteling', subtitle: 'Stunt Show', image: 'https://images.unsplash.com/photo-1533230393124-7484ef92bb09?auto=format&fit=crop&q=80&w=800', score: 9.5, trend: 'stable' },
        { id: 32, position: 3, name: 'FiestAventura', park: 'PortAventura', subtitle: 'Lake Show', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800', score: 9.3, trend: 'stable' }
      ]
    }
  ]);

  displayLimit = signal<number>(20);

  activeCategory = computed(() => 
    this.categories().find(c => c.id === this.activeCategoryId()) || this.categories()[0]
  );

  displayedItems = computed(() => 
    this.activeCategory().items.slice(0, this.displayLimit())
  );

  hasMoreItems = computed(() => 
    this.activeCategory().items.length > this.displayLimit()
  );

  selectCategory(id: string) {
    this.activeCategoryId.set(id);
    this.displayLimit.set(20);
  }

  loadMore() {
    this.displayLimit.update(limit => limit + 20);
  }

  getScale(position: number): number {
    // Del 1 al 3
    if (position === 1) return 0.95;
    if (position === 2) return 0.90;
    if (position === 3) return 0.86;
    
    // Del 4 al 10 va bajando escalonadamente (ej. 0.83, 0.80, 0.78...)
    if (position >= 4 && position <= 10) {
      // Restamos progresivamente 0.02 o 0.03 por puesto
      const baseFor4 = 0.84;
      const step = 0.02;
      return +(baseFor4 - ((position - 4) * step)).toFixed(2);
    }
    
    // Del 11 en adelante se quedan igual al tamaño más pequeño del top 10
    return 0.72;
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
