import { Injectable, computed, inject, signal } from '@angular/core';
import { CollecteDto } from '@rdc/shared';
import { CollecteRepository, CreerCollecteDto } from '../ports/collecte.repository';

@Injectable({ providedIn: 'root' })
export class CollecteFacade {
  private readonly repo = inject(CollecteRepository);

  readonly collectes = signal<CollecteDto[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly count = computed(() => this.collectes().length);
  readonly enPreparation = computed(() =>
    this.collectes().filter(c => c.statut === 'PREPARATION')
  );
  readonly ouvertes = computed(() =>
    this.collectes().filter(c => c.statut === 'INSCRIPTIONS_OUVERTES')
  );

  charger(): void {
    this.loading.set(true);
    this.error.set(null);

    this.repo.findAll().subscribe({
      next: collectes => {
        this.collectes.set(collectes);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err?.error?.message ?? 'Erreur lors du chargement des collectes');
        this.loading.set(false);
      },
    });
  }

  creer(dto: CreerCollecteDto): void {
    this.loading.set(true);
    this.error.set(null);

    this.repo.creer(dto).subscribe({
      next: collecte => {
        this.collectes.update(list => [collecte, ...list]);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err?.error?.message ?? 'Erreur lors de la création de la collecte');
        this.loading.set(false);
      },
    });
  }

  ouvrirInscriptions(id: string): void {
    this.error.set(null);

    this.repo.ouvrirInscriptions(id).subscribe({
      next: () => {
        this.collectes.update(list =>
          list.map(c => c.id === id ? { ...c, statut: 'INSCRIPTIONS_OUVERTES' as const } : c)
        );
      },
      error: err => {
        this.error.set(err?.error?.message ?? "Erreur lors de l'ouverture des inscriptions");
      },
    });
  }

  ajouterMagasin(collecteId: string, magasinId: string): void {
    this.error.set(null);

    this.repo.ajouterMagasin(collecteId, magasinId).subscribe({
      next: () => {
        this.collectes.update(list =>
          list.map(c =>
            c.id === collecteId
              ? {
                  ...c,
                  participations: [
                    ...c.participations,
                    { magasinId, statut: 'EN_ATTENTE' as const },
                  ],
                }
              : c
          )
        );
      },
      error: err => {
        this.error.set(err?.error?.message ?? "Erreur lors de l'ajout du magasin");
      },
    });
  }
}
