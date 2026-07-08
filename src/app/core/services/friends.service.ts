import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import { from, Observable, map } from 'rxjs';

export interface FriendRequest {
  id: number;
  user_id: number;
  friend_id: number;
  user_username: string;
  friend_username: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  private supabaseService = inject(SupabaseService);
  private authService = inject(AuthService);

  get supabase() {
    return this.supabaseService.supabase;
  }

  // Obtener todas las relaciones donde el usuario esté involucrado
  getFriendships(): Observable<FriendRequest[]> {
    const userId = this.authService.currentUser()?.id;
    return from(
      this.supabase
        .from('friends')
        .select('*')
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
        .order('created_at', { ascending: false })
    ).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data as FriendRequest[];
      })
    );
  }

  // Enviar una solicitud de amistad
  sendRequest(friendId: number, friendUsername: string): Observable<FriendRequest> {
    const user = this.authService.currentUser();
    if (!user) throw new Error('Not authenticated');

    return from(
      this.supabase
        .from('friends')
        .insert({
          user_id: user.id,
          friend_id: friendId,
          user_username: user.username,
          friend_username: friendUsername,
          status: 'PENDING'
        })
        .select()
        .single()
    ).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data as FriendRequest;
      })
    );
  }

  // Responder a una solicitud
  respondRequest(requestId: number, status: 'ACCEPTED' | 'REJECTED'): Observable<FriendRequest> {
    return from(
      this.supabase
        .from('friends')
        .update({ status })
        .eq('id', requestId)
        .select()
        .single()
    ).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data as FriendRequest;
      })
    );
  }

  // Eliminar un amigo o cancelar solicitud
  removeFriend(requestId: number): Observable<void> {
    return from(
      this.supabase
        .from('friends')
        .delete()
        .eq('id', requestId)
    ).pipe(
      map(res => {
        if (res.error) throw res.error;
      })
    );
  }
}
