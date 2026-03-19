import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full h-full',
  },
})
export class App {
  protected readonly title = signal('RCManager');
  authService = inject(AuthService);
  
  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(s => !s);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }
}
