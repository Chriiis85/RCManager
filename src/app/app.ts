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
  
  showLogoutModal = signal(false);
  logoutCountdown = signal(100);
  private logoutInterval: any;

  toggleMenu() {
    this.isMenuOpen.update(s => !s);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  doLogout() {
    this.closeMenu();
    this.showLogoutModal.set(true);
    this.logoutCountdown.set(100);
    
    this.logoutInterval = setInterval(() => {
      this.logoutCountdown.update(c => c - 1);
      if (this.logoutCountdown() <= 0) {
        clearInterval(this.logoutInterval);
        this.showLogoutModal.set(false);
        this.authService.logout();
      }
    }, 20);
  }
}
