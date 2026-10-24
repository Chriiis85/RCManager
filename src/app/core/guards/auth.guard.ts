import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Protege rutas que requieren autenticación
export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Si hay un callback de OAuth activo en proceso, permitir el acceso a /login para procesarlo
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};

// Protege rutas de login/registro (redirige a /profile si ya estás autenticado)
export const unAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si hay un callback de OAuth activo en curso, permitir permanecer en /login para procesarlo y mostrar el loader
  if (authService.isOAuthLoading()) {
    return true;
  }

  if (!authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/profile']);
};
