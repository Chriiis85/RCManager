import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ViajesComponent } from './pages/viajes/viajes.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { CreditsComponent } from './pages/credits/credits.component';
import { AttractionsComponent } from './pages/attractions/attractions.component';
import { ParksComponent } from './pages/parks/parks.component';
import { RankingComponent } from './pages/ranking/ranking.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { MisCreditsComponent } from './pages/mis-credits/mis-credits.component';
import { MisAtraccionesComponent } from './pages/mis-atracciones/mis-atracciones.component';
import { MisParquesComponent } from './pages/mis-parques/mis-parques.component';
import { authGuard, unAuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'viajes', component: ViajesComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent, canActivate: [unAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [unAuthGuard] },
  { path: 'credits', component: CreditsComponent },
  { path: 'atracciones', component: AttractionsComponent },
  { path: 'parques', component: ParksComponent },
  { path: 'ranking', component: RankingComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'mis-credits', component: MisCreditsComponent, canActivate: [authGuard] },
  { path: 'mis-atracciones', component: MisAtraccionesComponent, canActivate: [authGuard] },
  { path: 'mis-parques', component: MisParquesComponent, canActivate: [authGuard] }
];
