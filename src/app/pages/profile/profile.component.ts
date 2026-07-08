import { BlockScrollDirective } from '../../core/directives/block-scroll.directive';
import { Component, ChangeDetectionStrategy, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { RecordsService, CoasterCredit, AttractionRecord, ParkVisit } from '../../core/services/records.service';
import { SupabaseService } from '../../core/services/supabase.service';
import { FriendsService, FriendRequest } from '../../core/services/friends.service';
import { TripsService } from '../../core/services/trips.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
  imports: [CommonModule, FormsModule, RouterLink, BlockScrollDirective],
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  recordsService = inject(RecordsService);
  supabaseService = inject(SupabaseService);
  friendsService = inject(FriendsService);
  tripsService = inject(TripsService);
  
  private get _user() { return this.authService.currentUser(); }

  userInfo = signal<UserInfo>({
    username: this._user?.username || 'UsuarioAventurero',
    firstName: this._user?.firstName || '',
    lastName: this._user?.lastName || '',
    email: this._user?.email || '',
    avatar: this._user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(this._user?.username || 'User')}&background=1D4ED8&color=fff&size=200`
  });

  stats = signal({ credits: 0, parks: 0, attractions: 0 });
  isLoading = signal(true);

  // Listas completas de registros reales
  creditsList = signal<CoasterCredit[]>([]);
  attractionsList = signal<AttractionRecord[]>([]);
  parksList = signal<ParkVisit[]>([]);

  // ── Delete confirm modal ─────────────────────────────────────────────────
  showDeleteConfirmModal = signal(false);
  selectedItem          = signal<any>(null);
  selectedItemType      = signal<'credit' | 'attraction' | 'park' | ''>('');

  // ── Delete success modal ─────────────────────────────────────────────────
  showDeleteSuccessModal = signal(false);
  countdown              = signal(2);
  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  // Computed display name for the modal
  get deleteItemDisplayName(): string {
    const item = this.selectedItem();
    const type = this.selectedItemType();
    if (!item) return '';
    if (type === 'credit')     return item.coaster?.name    || `Montaña Rusa #${item.coasterId}`;
    if (type === 'attraction') return item.attraction?.name || `Atracción #${item.attractionId}`;
    if (type === 'park')       return item.park?.name       || `Parque #${item.parkId}`;
    return '';
  }

  // Open confirm modal
  openDeleteConfirm(item: any, type: 'credit' | 'attraction' | 'park') {
    this.selectedItem.set(item);
    this.selectedItemType.set(type);
    this.showDeleteConfirmModal.set(true);
  }

  // Confirmed → call API, then show success modal with countdown
  confirmDelete() {
    const item = this.selectedItem();
    const type = this.selectedItemType();
    if (!item || !type) { this.showDeleteConfirmModal.set(false); return; }

    this.showDeleteConfirmModal.set(false);

    const afterDelete = () => {
      this.loadStats();
      this.openDeleteSuccessModal();
    };

    if (type === 'credit')     this.recordsService.removeCredit(item.coasterId).subscribe(afterDelete);
    if (type === 'attraction') this.recordsService.removeAttraction(item.attractionId).subscribe(afterDelete);
    if (type === 'park')       this.recordsService.removePark(item.parkId).subscribe(afterDelete);
  }

  // Show success modal + auto-close after 2 s
  openDeleteSuccessModal() {
    this.countdown.set(2);
    this.showDeleteSuccessModal.set(true);

    this.countdownInterval = setInterval(() => {
      const c = this.countdown() - 1;
      this.countdown.set(c);
      if (c <= 0) this.closeDeleteSuccess();
    }, 1000);
  }

  closeDeleteSuccess() {
    if (this.countdownInterval) { clearInterval(this.countdownInterval); this.countdownInterval = null; }
    this.showDeleteSuccessModal.set(false);
    this.selectedItem.set(null);
    this.selectedItemType.set('');
  }

  // ────────────────────────────────────────────────────────────────────────

  ngOnInit() { 
    this.loadStats(); 
    this.loadFriends();
  }

  ngOnDestroy() {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
  }

  loadStats() {
    this.isLoading.set(true);
    forkJoin({
      credits: this.recordsService.getCredits(),
      attractions: this.recordsService.getAttractions(),
      parks: this.recordsService.getParks()
    }).subscribe({
      next: ({ credits, attractions, parks }) => {
        this.creditsList.set(credits);
        this.attractionsList.set(attractions);
        this.parksList.set(parks);
        this.stats.set({
          credits: credits.length,
          attractions: attractions.length,
          parks: parks.length
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  updateParkCount(parkId: number, currentCount: number | null, change: number) {
    const newCount = Math.max(1, (currentCount || 1) + change);
    this.recordsService.updateParkCount(parkId, newCount).subscribe({
      next: (updated) => {
        this.parksList.update(list => list.map(p => p.id === updated.id ? updated : p));
      },
      error: (err) => console.error('Error updating park count:', err)
    });
  }

  // ── Friends & Requests ──────────────────────────────────────────────────
  friendRequests = signal<FriendRequest[]>([]);
  showAddFriendModal = signal(false);
  searchUserQuery = signal('');
  suggestedUsers = signal<{id: number, username: string}[]>([]);
  private userSearch$ = new Subject<string>();

  constructor() {
    this.userSearch$.pipe(debounceTime(300), distinctUntilChanged()).subscribe(q => {
      if (q.length < 2) { this.suggestedUsers.set([]); return; }
      this.tripsService.searchUsers(q).subscribe({
        next: users => {
          const currentUserId = this._user?.id;
          // Filter out existing friends, sent requests, and oneself
          const existingIds = this.friendRequests().flatMap(r => [r.user_id, r.friend_id]);
          this.suggestedUsers.set(users.filter(u => u.id !== currentUserId && !existingIds.includes(u.id)));
        }
      });
    });
  }

  get myFriends(): FriendRequest[] {
    return this.friendRequests().filter(r => r.status === 'ACCEPTED');
  }

  get pendingIncoming(): FriendRequest[] {
    const currentUserId = this._user?.id;
    return this.friendRequests().filter(r => r.status === 'PENDING' && r.friend_id === currentUserId);
  }

  get pendingOutgoing(): FriendRequest[] {
    const currentUserId = this._user?.id;
    return this.friendRequests().filter(r => r.status === 'PENDING' && r.user_id === currentUserId);
  }

  getFriendUsername(req: FriendRequest): string {
    const currentUserId = this._user?.id;
    return req.user_id === currentUserId ? req.friend_username : req.user_username;
  }

  getFriendAvatar(req: FriendRequest): string {
    const name = this.getFriendUsername(req);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1D4ED8&color=fff`;
  }

  loadFriends() {
    this.friendsService.getFriendships().subscribe({
      next: (reqs) => this.friendRequests.set(reqs),
      error: (err) => console.error('Error loading friends', err)
    });
  }

  onFriendSearchChange(q: string) {
    this.searchUserQuery.set(q);
    this.userSearch$.next(q);
  }

  sendFriendRequest(user: {id: number, username: string}) {
    this.friendsService.sendRequest(user.id, user.username).subscribe({
      next: (req) => {
        this.friendRequests.update(list => [req, ...list]);
        this.suggestedUsers.update(list => list.filter(u => u.id !== user.id));
        this.showFeedback('Solicitud Enviada', `Has enviado una solicitud de amistad a @${user.username}`, 'success');
      },
      error: () => this.showFeedback('Error', 'No se pudo enviar la solicitud.', 'info')
    });
  }

  acceptFriend(req: FriendRequest) {
    this.friendsService.respondRequest(req.id, 'ACCEPTED').subscribe({
      next: (updated) => {
        this.friendRequests.update(list => list.map(r => r.id === updated.id ? updated : r));
        this.showFeedback('Solicitud Aceptada', `Ahora eres amigo de @${this.getFriendUsername(updated)}`, 'success');
      }
    });
  }

  rejectFriend(req: FriendRequest) {
    this.friendsService.respondRequest(req.id, 'REJECTED').subscribe({
      next: (updated) => {
        this.friendRequests.update(list => list.map(r => r.id === updated.id ? updated : r));
      }
    });
  }

  removeFriend(req: FriendRequest) {
    this.friendsService.removeFriend(req.id).subscribe({
      next: () => {
        this.friendRequests.update(list => list.filter(r => r.id !== req.id));
      }
    });
  }

  upcomingTrips = signal<TripSummary[]>([
    { id: 1, parkName: 'Phantasialand', date: '15 Sep 2026', image: 'https://images.unsplash.com/photo-1769713727279-ee0eeee2efcf?auto=format&fit=crop&q=80&w=400' },
    { id: 2, parkName: 'Europa-Park',   date: '22 Oct 2026', image: 'https://images.unsplash.com/photo-1719640502390-5c6e85176ea9?auto=format&fit=crop&q=80&w=400' }
  ]);

  showPasswordModal    = signal(false);
  isTwoFactorEnabled   = signal(false);
  showEditProfileModal = signal(false);
  editForm             = signal<UserInfo>({ ...this.userInfo() });

  showFeedbackModal = signal(false);
  feedbackContent   = signal({ title: '', message: '', type: 'success' });
  
  usernameSuggestions = signal<string[]>([]);

  showFeedback(title: string, message: string, type: 'success' | 'info' = 'success') {
    this.feedbackContent.set({ title, message, type });
    this.showFeedbackModal.set(true);
  }

  changeAvatar() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      this.isLoading.set(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${this.userInfo().username}_${Date.now()}.${fileExt}`;
        
        const { data, error } = await this.supabaseService.supabase
          .storage
          .from('ProfileImages')
          .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = this.supabaseService.supabase
          .storage
          .from('ProfileImages')
          .getPublicUrl(fileName);

        this.authService.updateProfile({ profileImage: publicUrl }).subscribe({
          next: (updatedUser) => {
            this.userInfo.set({
              ...this.userInfo(),
              avatar: updatedUser.profileImage || this.userInfo().avatar
            });
            this.isLoading.set(false);
            this.showFeedback('Foto Actualizada', 'Tu foto de perfil se ha guardado correctamente.', 'success');
          },
          error: (err) => {
            console.error(err);
            this.isLoading.set(false);
            this.showFeedback('Error', 'No se pudo guardar la foto en tu perfil.', 'info');
          }
        });
      } catch (error: any) {
        console.error(error);
        this.isLoading.set(false);
        this.showFeedback('Error de Subida', error.message || 'No se pudo subir la imagen.', 'info');
      }
    };
    input.click();
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

  openEditProfile() { this.editForm.set({ ...this.userInfo() }); this.showEditProfileModal.set(true); }

  saveProfile() {
    this.usernameSuggestions.set([]); // Limpiar sugerencias previas
    const dataToSave = {
      firstName: this.editForm().firstName,
      lastName: this.editForm().lastName,
      username: this.editForm().username !== this.userInfo().username ? this.editForm().username : undefined
    };
    
    this.authService.updateProfile(dataToSave).subscribe({
      next: (updatedUser) => {
        this.userInfo.set({
          ...this.userInfo(),
          firstName: updatedUser.firstName || '',
          lastName: updatedUser.lastName || '',
          username: updatedUser.username || this.userInfo().username
        });
        this.showEditProfileModal.set(false);
        this.showFeedback('Datos Guardados', 'Los datos de tu perfil se actualizaron correctamente.', 'success');
      },
      error: (err) => {
        console.error(err);
        if (err.status === 409 && err.error?.suggestions) {
          this.usernameSuggestions.set(err.error.suggestions);
          // No cerramos el modal para que pueda elegir una sugerencia
        } else {
          this.showFeedback('Error', 'Hubo un problema guardando tu perfil.', 'info');
        }
      }
    });
  }

  selectSuggestion(suggestion: string) {
    this.editForm.set({ ...this.editForm(), username: suggestion });
    this.usernameSuggestions.set([]);
  }
}
