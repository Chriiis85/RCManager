import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated = signal<boolean>(false);
  currentUser = signal<string | null>(null);

  login(email: string) {
    this.isAuthenticated.set(true);
    // Mocking the user name
    this.currentUser.set(email.split('@')[0]);
  }

  logout() {
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
  }
}
