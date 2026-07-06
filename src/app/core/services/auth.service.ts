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
    // Escuchar cambios en la sesión de Supabase (Login con Google)
    this.supabaseService.supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // Mapear el usuario de Supabase al formato que espera RCManager
        const supaUser: User = {
          id: 0, // Supabase usa UUIDs de texto, pero ponemos 0 temporalmente
          username: session.user.user_metadata['full_name'] || 'Usuario Google',
          email: session.user.email || '',
          role: 'user',
          createdAt: session.user.created_at
        };
        
        localStorage.setItem(TOKEN_KEY, session.access_token);
        localStorage.setItem(USER_KEY, JSON.stringify(supaUser));
        this._token.set(session.access_token);
        this._user.set(supaUser);
        
        // Si el evento es SIGNED_IN (acabamos de volver de Google), forzamos la redirección
        // porque el AuthGuard de Angular suele ejecutarse antes de que Supabase procese el token.
        if (event === 'SIGNED_IN') {
          this.router.navigate(['/profile']);
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
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/']);
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
