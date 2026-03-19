import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ViajesComponent } from './pages/viajes/viajes.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'viajes', component: ViajesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];
