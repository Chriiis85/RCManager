import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface UserInfo {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
}

interface Friend {
  id: number;
  username: string;
  avatar: string;
}

interface TripSummary {
  id: number;
  parkName: string;
  date: string;
  image: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  authService = inject(AuthService);
  
  userInfo = signal<UserInfo>({
    username: this.authService.currentUser() || 'UsuarioAventurero',
    firstName: 'Kriz',
    lastName: 'Martinez',
    email: 'kriz.martinez@example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
  });

  stats = signal({
    credits: 42,
    parks: 12,
    attractions: 156
  });

  friends = signal<Friend[]>([
    { id: 1, username: 'RollerFan99', avatar: 'https://ui-avatars.com/api/?name=Roller+Fan&background=0D1B3E&color=fff' },
    { id: 2, username: 'CoasterKing', avatar: 'https://ui-avatars.com/api/?name=Coaster+King&background=1D4ED8&color=fff' },
    { id: 3, username: 'ThrillSeeker', avatar: 'https://ui-avatars.com/api/?name=Thrill+Seeker&background=F59E0B&color=fff' },
    { id: 4, username: 'ParkHopper', avatar: 'https://ui-avatars.com/api/?name=Park+Hopper&background=10B981&color=fff' },
  ]);

  upcomingTrips = signal<TripSummary[]>([
    { 
      id: 1, 
      parkName: 'Phantasialand', 
      date: '15 Sep 2026', 
      image: 'https://images.unsplash.com/photo-1769713727279-ee0eeee2efcf?auto=format&fit=crop&q=80&w=400' 
    },
    { 
      id: 2, 
      parkName: 'Europa-Park', 
      date: '22 Oct 2026', 
      image: 'https://images.unsplash.com/photo-1719640502390-5c6e85176ea9?auto=format&fit=crop&q=80&w=400' 
    }
  ]);

  showPasswordModal = signal(false);
  isTwoFactorEnabled = signal(false);
  
  showEditProfileModal = signal(false);
  editForm = signal<UserInfo>({ ...this.userInfo() });

  changeAvatar() {
    alert('Simulación: Apertura de explorador de archivos para subir nueva foto.');
  }

  changePassword() {
    this.showPasswordModal.set(false);
    alert('Contraseña cambiada exitosamente (Simulación)');
  }

  toggleTwoFactor() {
    this.isTwoFactorEnabled.set(!this.isTwoFactorEnabled());
    const status = this.isTwoFactorEnabled() ? 'activada' : 'desactivada';
    alert(`Verificación en dos pasos ${status} (Simulación)`);
  }

  openEditProfile() {
    this.editForm.set({ ...this.userInfo() });
    this.showEditProfileModal.set(true);
  }

  saveProfile() {
    this.userInfo.set({ ...this.editForm() });
    this.showEditProfileModal.set(false);
    alert('Datos de perfil actualizados (Simulación)');
  }
}
