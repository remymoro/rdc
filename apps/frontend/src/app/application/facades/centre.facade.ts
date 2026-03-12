import { Injectable, inject, signal, computed } from '@angular/core';
import { CentreDto, CreerCentreDto, ModifierCentreDto } from '@rdc/shared';
import { CentreRepository } from '../../domain/centre.repository';

@Injectable({ providedIn: 'root' })
export class CentreFacade {
  private readonly repo = inject(CentreRepository);

  // STATE
  readonly centres = signal<CentreDto[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // COMPUTED
  readonly centresActifs = computed(() =>
    this.centres().filter(c => c.statut === 'ACTIF')
  );
  readonly count = computed(() => this.centres().length);

  // ACTIONS
  charger(): void {
    this.loading.set(true);
    this.error.set(null);
    this.repo.findAll().subscribe({
      next: (data) => {
        this.centres.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Erreur lors du chargement');
        this.loading.set(false);
      },
    });
  }

  creer(dto: CreerCentreDto): void {
    this.loading.set(true);
    this.error.set(null);
    this.repo.creer(dto).subscribe({
      next: (centre) => {
        this.centres.update(list => [...list, centre]);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Erreur lors de la création');
        this.loading.set(false);
      },
    });
  }

  modifier(id: string, dto: ModifierCentreDto): void {
    this.loading.set(true);
    this.error.set(null);
    this.repo.modifier(id, dto).subscribe({
      next: (centre) => {
        this.centres.update(list => list.map(c => c.id === id ? centre : c));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Erreur lors de la modification');
        this.loading.set(false);
      },
    });
  }

  desactiver(id: string): void {
    this.repo.desactiver(id).subscribe({
      next: () => {
        this.centres.update(list =>
          list.map(c => c.id === id ? { ...c, statut: 'INACTIF' as const } : c)
        );
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Erreur lors de la désactivation');
      },
    });
  }

  activer(id: string): void {
    this.repo.activer(id).subscribe({
      next: () => {
        this.centres.update(list =>
          list.map(c => c.id === id ? { ...c, statut: 'ACTIF' as const } : c)
        );
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Erreur lors de la réactivation');
      },
    });
  }

  archiver(id: string): void {
    this.repo.archiver(id).subscribe({
      next: () => {
        this.centres.update(list =>
          list.map(c => c.id === id ? { ...c, statut: 'ARCHIVE' as const } : c)
        );
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Erreur lors de l\'archivage');
      },
    });
  }
}
