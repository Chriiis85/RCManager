import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RecordsService, ParkVisit } from '../../core/services/records.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-mis-parques',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-parques.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MisParquesComponent implements OnInit, OnDestroy {
  recordsService = inject(RecordsService);
  authService = inject(AuthService);
  router = inject(Router);

  parks = signal<ParkVisit[]>([]);
  isLoading = signal(true);
  searchQuery = signal('');

  // Modal states
  showDeleteModal = signal(false);
  showDeleteSuccessModal = signal(false);
  selectedPark = signal<ParkVisit | null>(null);
  isSubmitting = signal(false);
  countdown = signal(2);
  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  filteredParks = computed(() => {
    const q = this.searchQuery().toLowerCase();
    if (!q) return this.parks();
    return this.parks().filter(p =>
      (p.park?.name || '').toLowerCase().includes(q) ||
      (p.park?.country || '').toLowerCase().includes(q)
    );
  });

  ngOnInit() {
    this.loadParks();
  }

  loadParks() {
    this.isLoading.set(true);
    this.recordsService.getParks().subscribe({
      next: (data) => {
        this.parks.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  openDeleteModal(park: ParkVisit) {
    this.selectedPark.set(park);
    this.showDeleteModal.set(true);
  }

  confirmDelete() {
    const park = this.selectedPark();
    if (!park) return;
    this.isSubmitting.set(true);

    const idToDelete = park.park?.apiId || park.parkId;
    this.recordsService.removePark(idToDelete).subscribe({
      next: () => {
        this.parks.update(list => list.filter(p => p.id !== park.id));
        this.showDeleteModal.set(false);
        this.isSubmitting.set(false);
        this.openDeleteSuccessModal();
      },
      error: () => this.isSubmitting.set(false)
    });
  }

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
    this.selectedPark.set(null);
  }

  ngOnDestroy() {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
  }
}
