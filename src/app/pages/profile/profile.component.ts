import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RecordsService } from '../../core/services/records.service';

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
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  recordsService = inject(RecordsService);
  
  // Datos del usuario autenticado (desde el servicio real)
  private get _user() { return this.authService.currentUser(); }

  userInfo = signal<UserInfo>({
    username: this._user?.username || 'UsuarioAventurero',
    firstName: '',
    lastName: '',
    email: this._user?.email || '',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(this._user?.username || 'User')}&background=1D4ED8&color=fff&size=200`
  });

  stats = signal({
    credits: 0,
    parks: 0,
    attractions: 0
  });

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.recordsService.getCredits().subscribe(credits => {
      this.stats.update(s => ({ ...s, credits: credits.length }));
    });
    this.recordsService.getAttractions().subscribe(attractions => {
      this.stats.update(s => ({ ...s, attractions: attractions.length }));
    });
    this.recordsService.getParks().subscribe(parks => {
      this.stats.update(s => ({ ...s, parks: parks.length }));
    });
  }

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

  showFeedbackModal = signal(false);
  feedbackContent = signal({ title: '', message: '', type: 'success' });

  showFeedback(title: string, message: string, type: 'success' | 'info' = 'success') {
    this.feedbackContent.set({ title, message, type });
    this.showFeedbackModal.set(true);
  }

  changeAvatar() {
    this.showFeedback('Fotografía', 'Simulación: Apertura de explorador de archivos para subir nueva foto.', 'info');
  }

  changePassword() {
    this.showPasswordModal.set(false);
    this.showFeedback('Contraseña Cambiada', 'Tu contraseña se ha cambiado exitosamente (Simulación).', 'success');
  }

  toggleTwoFactor() {
    this.isTwoFactorEnabled.set(!this.isTwoFactorEnabled());
    const status = this.isTwoFactorEnabled() ? 'activada' : 'desactivada';
    this.showFeedback('Seguridad Actualizada', `La verificación en dos pasos ha sido ${status} (Simulación).`, 'success');
  }

  openEditProfile() {
    this.editForm.set({ ...this.userInfo() });
    this.showEditProfileModal.set(true);
  }

  saveProfile() {
    this.userInfo.set({ ...this.editForm() });
    this.showEditProfileModal.set(false);
    this.showFeedback('Datos Guardados', 'Los datos de tu perfil se actualizaron correctamente (Simulación).', 'success');
  }
}
