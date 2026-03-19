import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Attraction {
  id: number;
  name: string;
  park: string;
  country: string;
  type: string;
  intensity: 'Baja' | 'Media' | 'Alta' | 'Extrema';
  minHeight: string;
  duration: string;
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
export class AttractionsComponent {
  searchQuery = signal('');
  selectedType = signal('all');

  attractions = signal<Attraction[]>([
    {
      id: 1,
      name: 'Tutuki Splash',
      park: 'PortAventura Park',
      country: 'España',
      type: 'Acuática',
      intensity: 'Media',
      minHeight: '1.20m',
      duration: '5:00 min',
      image: 'https://images.unsplash.com/photo-1473216891040-2057398b1897?auto=format&fit=crop&q=80&w=800',
      description: 'Un volcán en erupción y una caída refrescante en la Polinesia.'
    },
    {
      id: 2,
      name: 'Phantom Manor',
      park: 'Disneyland Paris',
      country: 'Francia',
      type: 'Dark Ride',
      intensity: 'Baja',
      minHeight: 'Sin mín.',
      duration: '7:00 min',
      image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=800',
      description: 'Una mansión encantada llena de secretos y misterios del lejano oeste.'
    },
    {
      id: 3,
      name: 'Tower of Terror',
      park: 'Disney\'s Hollywood Studios',
      country: 'USA',
      type: 'Caída Libre',
      intensity: 'Alta',
      minHeight: '1.02m',
      duration: '4:00 min',
      image: 'https://images.unsplash.com/photo-1565867226341-34084fb1a40d?auto=format&fit=crop&q=80&w=800',
      description: 'Adéntrate en la Dimensión Desconocida en este hotel abandonado.'
    },
    {
      id: 4,
      name: 'Chiapas',
      park: 'Phantasialand',
      country: 'Alemania',
      type: 'Acuática',
      intensity: 'Media',
      minHeight: '1.20m',
      duration: '6:00 min',
      image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=800',
      description: 'El log flume con la caída más inclinada del mundo.'
    },
    {
      id: 5,
      name: 'Hurakan Condor',
      park: 'PortAventura Park',
      country: 'España',
      type: 'Caída Libre',
      intensity: 'Extrema',
      minHeight: '1.40m',
      duration: '2:30 min',
      image: 'https://images.unsplash.com/photo-1513254222046-817812228834?auto=format&fit=crop&q=80&w=800',
      description: '100 metros de caída libre pura para los más valientes.'
    },
    {
      id: 6,
      name: 'Ratatouille: The Adventure',
      park: 'Walt Disney Studios',
      country: 'Francia',
      type: '4D Experience',
      intensity: 'Baja',
      minHeight: 'Sin mín.',
      duration: '5:00 min',
      image: 'https://images.unsplash.com/photo-1707508465463-989ccfddbafa?auto=format&fit=crop&q=80&w=800',
      description: 'Encoge al tamaño de Remy en esta aventura gastronómica 4D.'
    }
  ]);

  filteredAttractions = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const type = this.selectedType();
    
    return this.attractions().filter(a => {
      const matchesSearch = a.name.toLowerCase().includes(query) || 
                          a.park.toLowerCase().includes(query) ||
                          a.country.toLowerCase().includes(query);
      
      const matchesType = type === 'all' || a.type === type;
      
      return matchesSearch && matchesType;
    });
  });

  types = computed(() => {
    const allTypes = this.attractions().map(a => a.type);
    return ['all', ...new Set(allTypes)];
  });

  updateSearch(query: string) {
    this.searchQuery.set(query);
  }

  updateType(type: string) {
    this.selectedType.set(type);
  }

  getIntensityClass(intensity: Attraction['intensity']) {
    switch (intensity) {
      case 'Baja': return 'bg-blue-100 text-blue-700 ring-blue-700/10';
      case 'Media': return 'bg-yellow-100 text-yellow-700 ring-yellow-700/10';
      case 'Alta': return 'bg-orange-100 text-orange-700 ring-orange-700/10';
      case 'Extrema': return 'bg-red-100 text-red-700 ring-red-700/10';
    }
  }
}
