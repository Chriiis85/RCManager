import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface RankingItem {
  id: number;
  position: number;
  name: string;
  subtitle: string;
  park?: string;
  image: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
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
  activeCategoryId = signal<string>('parks');

  categories = signal<RankingCategory[]>([
    {
      id: 'parks',
      name: 'Mejores Parques',
      icon: '🎡',
      items: [
        { id: 1, position: 1, name: 'Europa-Park', subtitle: 'Rust, Alemania', image: 'https://images.unsplash.com/photo-1719640502390-5c6e85176ea9?auto=format&fit=crop&q=80&w=800', score: 9.8, trend: 'stable' },
        { id: 2, position: 2, name: 'PortAventura Park', subtitle: 'Salou, España', image: 'https://images.unsplash.com/photo-1547675960-7634cf1b0856?auto=format&fit=crop&q=80&w=800', score: 9.6, trend: 'up' },
        { id: 3, position: 3, name: 'Cedar Point', subtitle: 'Ohio, USA', image: 'https://images.unsplash.com/photo-1600229783609-26c4ebb3fb49?auto=format&fit=crop&q=80&w=800', score: 9.5, trend: 'down' },
        { id: 4, position: 4, name: 'Phantasialand', subtitle: 'Brühl, Alemania', image: 'https://images.unsplash.com/photo-1769713727279-ee0eeee2efcf?auto=format&fit=crop&q=80&w=800', score: 9.4, trend: 'up' },
        { id: 5, position: 5, name: 'Alton Towers', subtitle: 'Staffordshire, UK', image: 'https://images.unsplash.com/photo-1628835788312-41d61f5ddce8?auto=format&fit=crop&q=80&w=800', score: 9.2, trend: 'stable' }
      ]
    },
    {
      id: 'coasters',
      name: 'Montañas Rusas',
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
      id: 'water_rides',
      name: 'Atracciones Acuáticas',
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

  activeCategory = computed(() => 
    this.categories().find(c => c.id === this.activeCategoryId()) || this.categories()[0]
  );

  selectCategory(id: string) {
    this.activeCategoryId.set(id);
  }
}
