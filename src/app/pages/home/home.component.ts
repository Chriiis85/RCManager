import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

export interface WebFeature {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
  points: string[];
  image: string;
  imageAlt: string;
  route?: string;
  externalUrl?: string;
  ctaText: string;
  requiresAuth?: boolean;
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

  // Características reales ilustradas con capturas verídicas de nuestra aplicación
  features: WebFeature[] = [
    {
      id: 'credits',
      badge: 'Contador Personal',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
      title: 'Tu Diario y Contador de Credits',
      description: 'Un "credit" es cada montaña rusa en la que te has subido. En RCManager puedes buscarlas en nuestra base de datos, marcarlas como conseguidas, registrar cuántas veces te has subido y puntuarlas del 1 al 10.',
      points: [
        'Contador total de credits conseguidos en tu perfil',
        'Puntuación del 1 al 10 con contador de repeticiones',
        'Filtro rápido por país y parque temático'
      ],
      image: '/screenshots/credits-app.png',
      imageAlt: 'Captura real de la pantalla de Credits en RCManager',
      route: '/credits',
      ctaText: 'Ver Catálogo de Credits'
    },
    {
      id: 'atracciones',
      badge: 'Fichas Técnicas',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200/80 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800',
      title: 'Catálogo Completo de Atracciones',
      description: 'Explora miles de atracciones de parques de todo el mundo con sus especificaciones técnicas reales: velocidad punta, altura máxima, longitud, número de inversiones y fabricante.',
      points: [
        'Filtro por fabricante: Intamin, B&M, Mack Rides, RMC y Vekoma',
        'Estado operativo en tiempo real para saber si está abierta',
        'Ficha detallada con parque de origen y año de inauguración'
      ],
      image: '/screenshots/atracciones-app.png',
      imageAlt: 'Captura real del catálogo de atracciones en RCManager',
      route: '/atracciones',
      ctaText: 'Explorar Atracciones'
    },
    {
      id: 'parques',
      badge: 'Tiempos en Vivo',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
      title: 'Parques Temáticos y Tiempos de Espera',
      description: 'Directorio internacional de parques de ocio conectado a la API de tiempos de espera en vivo. Consulta antes de ir si el parque está abierto, su nivel de afluencia y las colas de cada atracción.',
      points: [
        'Tiempos de espera actualizados al minuto',
        'Indicador de afluencia del parque: Baja, Normal o Alta',
        'Listado completo de atracciones operativas por parque'
      ],
      image: '/screenshots/parques-app.png',
      imageAlt: 'Captura real del directorio de parques con tiempos de espera en vivo',
      route: '/parques',
      ctaText: 'Consultar Parques'
    },
    {
      id: 'viajes',
      badge: 'Planificador',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
      title: 'Planificador de Viajes con Amigos',
      description: 'Organiza tus próximas visitas a parques temáticos con un calendario dedicado, cuenta regresiva en vivo hasta el día de la visita y añade a tus amigos para coordinar la escapada juntos.',
      points: [
        'Cuenta regresiva en vivo con días y horas restantes',
        'Invita a amigos registrados en la plataforma',
        'Guarda tu lista privada de atracciones que queréis probar'
      ],
      image: '/screenshots/viajes-app.png',
      imageAlt: 'Captura real del planificador de viajes de RCManager',
      route: '/viajes',
      ctaText: 'Planificar un Viaje',
      requiresAuth: true
    },
    {
      id: 'ranking',
      badge: 'Premios Oficiales',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
      title: 'Ranking Global de Montañas Rusas',
      description: 'Descubre los destinos y atracciones mejor valorados del planeta con clasificaciones basadas en los prestigiosos Golden Ticket Awards y en las notas de los usuarios.',
      points: [
        'Top mundial de montañas rusas de acero y de madera',
        'Los mejores parques temáticos y familiares del mundo',
        'Puntuaciones transparentes del 1 al 100'
      ],
      image: '/screenshots/ranking-app.png',
      imageAlt: 'Captura real del ranking global de montañas rusas',
      route: '/ranking',
      ctaText: 'Ver Ranking Global'
    },
    {
      id: 'parksia',
      badge: 'Herramienta Externa',
      badgeColor: 'bg-violet-50 text-violet-700 border-violet-200/80 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-800',
      title: 'ParksIA: Tu Asistente Inteligente',
      description: 'Herramienta complementaria con inteligencia artificial especializada en parques temáticos. Pídele rutas óptimas para evitar colas, recomendaciones según tus gustos o datos técnicos al instante.',
      points: [
        'Planificación inteligente de itinerarios de parque',
        'Respuestas inmediatas sobre récords y especificaciones',
        'Herramienta web externa accesible en un clic'
      ],
      image: '/screenshots/parksia-app.png',
      imageAlt: 'Captura real de la herramienta ParksIA',
      externalUrl: 'https://parks-ia.vercel.app',
      ctaText: 'Abrir ParksIA'
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

  scrollToFeatures() {
    const el = document.getElementById('funciones');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
