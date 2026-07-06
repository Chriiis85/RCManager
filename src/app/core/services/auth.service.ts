import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { SupabaseService } from './supabase.service';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

const API_BASE = 'https://rc-manager-api.vercel.app/api/auth';
const TOKEN_KEY = 'rcm_token';
const USER_KEY = 'rcm_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private supabaseService = inject(SupabaseService);

  // Flag para evitar que Supabase re-autentique durante un logout activo
  private _isLoggingOut = false;

  // Signals de estado
  private _token = signal<string | null>(this.getStoredToken());
  private _user = signal<User | null>(this.getStoredUser());

  // Expuestos como readonly
  readonly currentUser = this._user.asReadonly();
  readonly token = this._token.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token() && !!this._user());

  constructor() {
    this.supabaseService.supabase.auth.onAuthStateChange((event, session) => {
      // Si estamos en proceso de logout, ignoramos cualquier evento de Supabase
      if (this._isLoggingOut) return;

      if (session) {
        if (event === 'SIGNED_IN') {
          // Pedimos a nuestro backend que valide el token de Supabase y nos devuelva un JWT oficial.
          this.http.post<AuthResponse>(`${API_BASE}/supabase`, { access_token: session.access_token }).subscribe({
            next: (res) => {
              this.handleAuthSuccess(res);
              const currentUrl = this.router.url;
              if (currentUrl.includes('/login') || currentUrl.includes('/register')) {
                this.router.navigate(['/profile']);
              }
            },
            error: (err) => {
              console.error('Error al intercambiar el token de Supabase con el backend:', err);
              this.logout();
            }
          });
        }
      } else {
        if (event === 'SIGNED_OUT') {
          // Solo limpiar senales de Angular, no llamar a logout() de nuevo
          this._token.set(null);
          this._user.set(null);
        }
      }
    });
  }

  // Register
  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE}/register`, payload).pipe(
      tap(res => this.handleAuthSuccess(res)),
      catchError(err => throwError(() => err))
    );
  }

  // Login
  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE}/login`, payload).pipe(
      tap(res => this.handleAuthSuccess(res)),
      catchError(err => throwError(() => err))
    );
  }

  // Supabase Google Login
  async signInWithGoogle(): Promise<void> {
    const { error } = await this.supabaseService.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/login'
      }
    });

    if (error) {
      console.error('Error iniciando sesion con Google:', error.message);
      throw error;
    }
  }

  // Logout
  logout(): void {
    // Activar el flag para bloquear eventos de Supabase durante el logout
    this._isLoggingOut = true;

    // 1. Limpiar senales de Angular inmediatamente
    this._token.set(null);
    this._user.set(null);

    // 2. Limpiar localStorage de forma sincrona y agresiva
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      // Borrar TODAS las claves de Supabase del localStorage
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('sb-')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    }

    // 3. Navegar al inicio
    this.router.navigate(['/']);

    // 4. Cerrar sesion en Supabase de forma async
    this.supabaseService.supabase.auth.signOut().finally(() => {
      // Resetear el flag despues de un momento para permitir futuros logins
      setTimeout(() => { this._isLoggingOut = false; }, 2000);
    });
  }

  // Get auth headers
  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this._token()}` });
  }

  private handleAuthSuccess(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    this._token.set(res.token);
    this._user.set(res.user);
  }

  private getStoredToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  }

  private getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(USER_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
