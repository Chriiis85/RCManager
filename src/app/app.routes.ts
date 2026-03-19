import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ViajesComponent } from './pages/viajes/viajes.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { CreditsComponent } from './pages/credits/credits.component';
import { AttractionsComponent } from './pages/attractions/attractions.component';
import { ParksComponent } from './pages/parks/parks.component';
import { RankingComponent } from './pages/ranking/ranking.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'viajes', component: ViajesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'credits', component: CreditsComponent },
  { path: 'atracciones', component: AttractionsComponent },
  { path: 'parques', component: ParksComponent },
  { path: 'ranking', component: RankingComponent }
];
