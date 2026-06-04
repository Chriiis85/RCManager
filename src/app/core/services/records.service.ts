import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

const API_BASE = 'https://rc-manager-api.vercel.app/api/me';

export interface CoasterCredit {
  id: number;
  userId: number;
  coasterId: number;
  rideDate: string | null;
  rating: number | null;
  review: string | null;
  coaster?: any; // Añadido para acceder a los datos de la montaña rusa
}

export interface AttractionRecord {
  id: number;
  userId: number;
  attractionId: number;
  rideDate: string | null;
  rating: number | null;
  attraction?: any;
}

export interface ParkVisit {
  id: number;
  userId: number;
  parkId: number;
  visitDate: string | null;
  park?: any;
}

@Injectable({
  providedIn: 'root'
})
export class RecordsService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // ── COASTER CREDITS ────────────────────────────────────────────────────────

  getCredits(): Observable<CoasterCredit[]> {
    return this.http.get<CoasterCredit[]>(`${API_BASE}/credits`, { headers: this.getHeaders() });
  }

  addCredit(coasterId: number, rideDate?: Date, rating?: number, review?: string): Observable<CoasterCredit> {
    return this.http.post<CoasterCredit>(`${API_BASE}/credits`, { coasterId, rideDate, rating, review }, { headers: this.getHeaders() });
  }

  removeCredit(coasterId: number): Observable<any> {
    return this.http.delete(`${API_BASE}/credits/${coasterId}`, { headers: this.getHeaders() });
  }

  // ── ATTRACTION RECORDS ───────────────────────────────────────────────────────

  getAttractions(): Observable<AttractionRecord[]> {
    return this.http.get<AttractionRecord[]>(`${API_BASE}/attractions`, { headers: this.getHeaders() });
  }

  addAttraction(attractionId: number, rideDate?: Date, rating?: number): Observable<AttractionRecord> {
    return this.http.post<AttractionRecord>(`${API_BASE}/attractions`, { attractionId, rideDate, rating }, { headers: this.getHeaders() });
  }

  removeAttraction(attractionId: number): Observable<any> {
    return this.http.delete(`${API_BASE}/attractions/${attractionId}`, { headers: this.getHeaders() });
  }

  // ── PARK VISITS ──────────────────────────────────────────────────────────────

  getParks(): Observable<ParkVisit[]> {
    return this.http.get<ParkVisit[]>(`${API_BASE}/parks`, { headers: this.getHeaders() });
  }

  addPark(parkId: number, visitDate?: Date): Observable<ParkVisit> {
    return this.http.post<ParkVisit>(`${API_BASE}/parks`, { parkId, visitDate }, { headers: this.getHeaders() });
  }

  removePark(parkId: number): Observable<any> {
    return this.http.delete(`${API_BASE}/parks/${parkId}`, { headers: this.getHeaders() });
  }
}
