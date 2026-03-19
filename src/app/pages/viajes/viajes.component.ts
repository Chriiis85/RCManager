import { Component, OnInit, OnDestroy, signal, WritableSignal, ChangeDetectionStrategy } from '@angular/core';

type Countdown = { days: number, hours: number, minutes: number, seconds: number };
interface Trip {
  id: number;
  country: string;
  parkName: string;
  subtitle: string;
  description: string;
  image: string;
  targetDate: Date;
  companions: { name: string; avatar: string }[];
  time: WritableSignal<Countdown>;
}

@Component({
  selector: 'app-viajes',
  standalone: true,
  templateUrl: './viajes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViajesComponent implements OnInit, OnDestroy {
  private timer: any;

  trips = signal<Trip[]>([
    {
      id: 1,
      country: 'Japón',
      parkName: 'Fuji-Q Highland',
      subtitle: 'Hogar de las montañas rusas más extremas.',
      description: 'Considerado uno de los parques temáticos más emocionantes de todo el mundo, sus montañas rusas baten récords a la sombra del mismísimo Monte Fuji. Prepárate para experimentar caídas imposibles y aceleraciones de infarto.',
      image: 'https://images.unsplash.com/photo-1596701548816-641505c24e65?q=80&w=2074&auto=format&fit=crop',
      targetDate: new Date(new Date().getTime() + 45 * 24 * 60 * 60 * 1000), // 45 days
      companions: [
        { name: 'Laura', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop' },
        { name: 'Marcos', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop' }
      ],
      time: signal({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    },
    {
      id: 2,
      country: 'España',
      parkName: 'Parque Warner',
      subtitle: 'Movie World Studios & Superhéroes.',
      description: 'Sumérgete en el universo cinematográfico y del cómic. Montañas rusas espectaculares como la de Superman o Batman te esperan en uno de los parques más completos del país.',
      image: 'https://images.unsplash.com/photo-1606767051141-8316e6f43702?q=80&w=2074&auto=format&fit=crop',
      targetDate: new Date(new Date().getTime() + 120 * 24 * 60 * 60 * 1000), // 120 days
      companions: [
        { name: 'Sofía', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop' }
      ],
      time: signal({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    },
    {
      id: 3,
      country: 'España',
      parkName: 'PortAventura World',
      subtitle: 'Seis mundos apasionantes.',
      description: 'Descubre increíbles atracciones como Shambhala y Dragon Khan. Un viaje épico que combina adrenalina pura con espectáculos de primer nivel en la Costa Dorada.',
      image: 'https://images.unsplash.com/photo-1547675960-7634cf1b0856?q=80&w=2074&auto=format&fit=crop',
      targetDate: new Date(new Date().getTime() + 210 * 24 * 60 * 60 * 1000), // 210 days
      companions: [
        { name: 'Carlos', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop' },
        { name: 'Elena', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop' },
        { name: 'Pablo', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop' }
      ],
      time: signal({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    }
  ]);

  ngOnInit() {
    this.calculateAllTimes();
    this.timer = setInterval(() => {
      this.calculateAllTimes();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  private calculateAllTimes() {
    const now = new Date().getTime();
    this.trips().forEach(trip => {
      const difference = trip.targetDate.getTime() - now;
      if (difference > 0) {
        trip.time.set({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    });
  }

  formatNumber(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
}
