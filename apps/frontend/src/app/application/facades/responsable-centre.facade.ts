import { Injectable, inject, signal, computed } from '@angular/core';
import {
  CreerResponsableCentreDto,
  ModifierResponsableCentreDto,
  ResponsableCentreDto,
} from '@rdc/shared';
import {
  ResponsableCentreFilters,
  ResponsableCentreRepository,
} from '../ports/responsable-centre.repository';

@Injectable({ providedIn: 'root' })
export class ResponsableCentreFacade {
  private readonly repo = inject(ResponsableCentreRepository);

  readonly responsables = signal<ResponsableCentreDto[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly actifs = computed(() => this.responsables().filter(r => r.isActive));
  readonly count = computed(() => this.responsables().length);

  charger(filters?: ResponsableCentreFilters): void {
    this.loading.set(true);
    this.error.set(null);

    this.repo.findAll(filters).subscribe({
      next: data => {
        this.responsables.set(data);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err?.error?.message ?? 'Erreur lors du chargement des responsables');
        this.loading.set(false);
      },
    });
  }

  creer(dto: CreerResponsableCentreDto): void {
    this.loading.set(true);
    this.error.set(null);

    this.repo.create(dto).subscribe({
      next: created => {
        this.responsables.update(list => [created, ...list]);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err?.error?.message ?? 'Erreur lors de la création');
        this.loading.set(false);
      },
    });
  }

  modifier(id: string, dto: ModifierResponsableCentreDto): void {
    this.loading.set(true);
    this.error.set(null);

    this.repo.update(id, dto).subscribe({
      next: updated => {
        this.responsables.update(list => list.map(item => (item.id === id ? updated : item)));
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err?.error?.message ?? 'Erreur lors de la modification');
        this.loading.set(false);
      },
    });
  }

  supprimer(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.repo.delete(id).subscribe({
      next: () => {
        this.responsables.update(list => list.map(item => (item.id === id ? { ...item, isActive: false } : item)));
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err?.error?.message ?? 'Erreur lors de la suppression');
        this.loading.set(false);
      },
    });
  }
}
