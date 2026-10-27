import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

export interface CoasterTickerItem {
  name: string;
  park: string;
  location: string;
  speed: string;
  height: string;
  waitTime: string;
  waitStatus: 'low' | 'normal' | 'high';
  tag: string;
  image?: string;
}

export interface TimelineStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  icon: string;
}

export interface PerkCard {
  title: string;
  badge: string;
  description: string;
  route?: string;
  externalUrl?: string;
  linkText: string;
  iconBg: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  // Ticker en vivo de montañas rusas emblemáticas
  readonly tickerItems: CoasterTickerItem[] = [
    {
      name: 'Fury 325',
      park: 'Carowinds',
      location: 'EE.UU.',
      speed: '153 km/h',
      height: '99 m',
      waitTime: '15 min',
      waitStatus: 'low',
      tag: '#1 Golden Ticket Coaster'
    },
    {
      name: 'Voltron Nevera',
      park: 'Europa-Park',
      location: 'Alemania',
      speed: '100 km/h',
      height: '32 m',
      waitTime: '25 min',
      waitStatus: 'normal',
      tag: 'Best New Coaster 2024'
    },
    {
      name: 'Zadra',
      park: 'Energylandia',
      location: 'Polonia',
      speed: '121 km/h',
      height: '63 m',
      waitTime: '10 min',
      waitStatus: 'low',
      tag: 'Top RMC Hybrid'
    },
    {
      name: 'Shambhala',
      park: 'PortAventura World',
      location: 'España',
      speed: '134 km/h',
      height: '76 m',
      waitTime: '20 min',
      waitStatus: 'normal',
      tag: 'Hypercoaster Legend'
    },
    {
      name: 'VelociCoaster',
      park: 'Universal Orlando',
      location: 'EE.UU.',
      speed: '113 km/h',
      height: '47 m',
      waitTime: '30 min',
      waitStatus: 'normal',
      tag: '#2 Steel Coaster GTA'
    },
    {
      name: 'Steel Vengeance',
      park: 'Cedar Point',
      location: 'EE.UU.',
      speed: '119 km/h',
      height: '62 m',
      waitTime: '35 min',
      waitStatus: 'high',
      tag: '#3 Steel Coaster GTA'
    }
  ];

  // 4 Pasos del Ciclo de Vida del Coaster Enthusiast (Estilo CrypGo Timeline)
  readonly timelineSteps: TimelineStep[] = [
    {
      number: '01',
      title: 'Explora y Filtra',
      subtitle: 'Catálogo Mundial',
      description: 'Accede a más de 4,500 montañas rusas y 800 parques mundiales. Filtra por fabricante (Intamin, B&M, Mack, RMC), velocidad punta, altura y número de inversiones.',
      badge: 'Buscador en Vivo',
      icon: 'search'
    },
    {
      number: '02',
      title: 'Registra tus Credits',
      subtitle: 'Contador Personal',
      description: 'Suma cada coaster con un solo clic. Añade tu puntuación personal del 1 al 10, cuenta las repeticiones y crea tu histórico verificado de conquistas.',
      badge: 'Diario Digital',
      icon: 'check'
    },
    {
      number: '03',
      title: 'Tiempos de Espera',
      subtitle: 'Colas al Minuto',
      description: 'Monitorea el estado operativo y los minutos exactos de cola en tiempo real de PortAventura, Europa-Park, Phantasialand y cientos de parques más.',
      badge: 'API en Vivo',
      icon: 'clock'
    },
    {
      number: '04',
      title: 'Planifica y Comparte',
      subtitle: 'Viajes con Amigos',
      description: 'Crea escapadas grupales, invita a tus amigos con cuenta, sigue una cuenta atrás en vivo y sincronizad qué atracciones son vuestra prioridad.',
      badge: 'Comunidad',
      icon: 'users'
    }
  ];

  // Pilares y Beneficios
  readonly perks: PerkCard[] = [
    {
      title: 'Comunidad y Amigos',
      badge: 'Red Social Coaster',
      description: 'Conéctate con otros entusiastas de habla hispana, añade amigos, compara vuestros credit counts y coordina viajes a parques juntos.',
      route: '/viajes',
      linkText: 'Ver Planificador de Viajes',
      iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400'
    },
    {
      title: 'Rankings Mundiales GTA',
      badge: 'Premios Oficiales',
      description: 'Consulta los podios mundiales de los prestigiosos Golden Ticket Awards y el informe anual TEA/AECOM con notas transparentes y datos reales.',
      route: '/ranking',
      linkText: 'Consultar Ranking 2025',
      iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'
    },
    {
      title: 'ParksIA: Asistente Inteligente',
      badge: 'Inteligencia Artificial',
      description: 'Genera rutas óptimas para evitar aglomeraciones en los parques y resuelve dudas sobre récords, aperturas y especificaciones técnicas.',
      externalUrl: 'https://parks-ia.vercel.app',
      linkText: 'Abrir Asistente ParksIA',
      iconBg: 'bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400'
    }
  ];

  // Navegación con comprobación previa de inicio de sesión
  navigateToViajes() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/viajes']);
    } else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/viajes' } });
    }
  }
}
