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

  // Signals de estado
  private _token = signal<string | null>(this.getStoredToken());
  private _user = signal<User | null>(this.getStoredUser());

  // Expuestos como readonly
  readonly currentUser = this._user.asReadonly();
  readonly token = this._token.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token() && !!this._user());

  constructor() {
    this.supabaseService.supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        if (event === 'SIGNED_IN') {
          // En lugar de usar el token de Supabase directamente, 
          // pedimos a nuestro backend que lo valide y nos devuelva un JWT oficial.
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
        // Si Supabase se desloguea (ej. caduca la sesión), limpiamos Angular
        if (event === 'SIGNED_OUT') {
          this.logout();
        }
      }
    });
  }

  // ── Register ──────────────────────────────────────────────────────────────
  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE}/register`, payload).pipe(
      tap(res => this.handleAuthSuccess(res)),
      catchError(err => throwError(() => err))
    );
  }

  // ── Login ─────────────────────────────────────────────────────────────────
  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE}/login`, payload).pipe(
      tap(res => this.handleAuthSuccess(res)),
      catchError(err => throwError(() => err))
    );
  }

  // ── Supabase Google Login ─────────────────────────────────────────────────
  async signInWithGoogle(): Promise<void> {
    const { error } = await this.supabaseService.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Redirigimos a /login (ruta desprotegida) para que Angular no destruya 
        // el #access_token de la URL antes de que Supabase lo lea.
        redirectTo: window.location.origin + '/login'
      }
    });
    
    if (error) {
      console.error('Error iniciando sesión con Google:', error.message);
      throw error;
    }
  }

  // ── Logout ────────────────────────────────────────────────────────────────
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      
      // Borrar forzosamente cualquier clave de Supabase por si el signOut falla
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith('sb-')) {
          localStorage.removeItem(key);
        }
      }
    }

    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/']);

    // Limpiar también la sesión de Supabase en el servidor para evitar que nos vuelva a loguear al refrescar
    this.supabaseService.supabase.auth.signOut().catch(console.error);
  }

  // ── Get auth headers (para peticiones protegidas) ─────────────────────────
  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this._token()}` });
  }

  // ── Helpers privados ──────────────────────────────────────────────────────
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
