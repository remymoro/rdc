import { Injectable, computed, inject, signal } from '@angular/core';
import { CreerMagasinDto, MagasinDto, ModifierMagasinDto } from '@rdc/shared';
import { MagasinFilters, MagasinRepository } from '../ports/magasin.repository';

@Injectable({ providedIn: 'root' })
export class MagasinFacade {
  private readonly repo = inject(MagasinRepository);
  private lastFilters: MagasinFilters | undefined;

  readonly magasins = signal<MagasinDto[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly actifs = computed(() => this.magasins().filter(magasin => magasin.statut === 'ACTIF'));
  readonly count = computed(() => this.magasins().length);

  charger(filters?: MagasinFilters): void {
    this.lastFilters = filters;
    this.loading.set(true);
    this.error.set(null);
   console.log('Chargement des magasins avec les filtres', filters);
    this.repo.findAll(filters).subscribe({
      next: magasins => {
        console.log('Magasins chargés', magasins);
        this.magasins.set(magasins);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err?.error?.message ?? 'Erreur lors du chargement des magasins');
        this.loading.set(false);
      },
    });
  }

  recharger(): void {
    this.charger(this.lastFilters);
  }

  creer(dto: CreerMagasinDto): void {
    this.loading.set(true);
    this.error.set(null);

    this.repo.creer(dto).subscribe({
      next: magasin => {
        this.magasins.update(list => [magasin, ...list]);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err?.error?.message ?? 'Erreur lors de la creation du magasin');
        this.loading.set(false);
      },
    });
  }

  modifier(id: string, dto: ModifierMagasinDto): void {
    this.loading.set(true);
    this.error.set(null);

    this.repo.modifier(id, dto).subscribe({
      next: magasin => {
        this.magasins.update(list => list.map(item => item.id === id ? magasin : item));
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err?.error?.message ?? 'Erreur lors de la modification du magasin');
        this.loading.set(false);
      },
    });
  }

  desactiver(id: string): void {
    this.repo.desactiver(id).subscribe({
      next: () => {
        this.magasins.update(list =>
          list.map(item => item.id === id ? { ...item, statut: 'INACTIF' as const } : item)
        );
      },
      error: err => {
        this.error.set(err?.error?.message ?? 'Erreur lors de la desactivation du magasin');
      },
    });
  }

  activer(id: string): void {
    this.repo.activer(id).subscribe({
      next: () => {
        this.magasins.update(list =>
          list.map(item => item.id === id ? { ...item, statut: 'ACTIF' as const } : item)
        );
      },
      error: err => {
        this.error.set(err?.error?.message ?? 'Erreur lors de la reactivation du magasin');
      },
    });
  }

  archiver(id: string): void {
    this.repo.archiver(id).subscribe({
      next: () => {
        this.magasins.update(list =>
          list.map(item => item.id === id ? { ...item, statut: 'ARCHIVE' as const } : item)
        );
      },
      error: err => {
        this.error.set(err?.error?.message ?? "Erreur lors de l'archivage du magasin");
      },
    });
  }

  ajouterImage(magasinId: string, file: File): void {
    this.error.set(null);

    this.repo.ajouterImage(magasinId, file).subscribe({
      next: image => {
        this.magasins.update(list =>
          list.map(item =>
            item.id === magasinId
              ? {
                  ...item,
                  images: [...item.images, image].sort((a, b) => a.ordre - b.ordre),
                  updatedAt: new Date(),
                }
              : item
          )
        );
      },
      error: err => {
        this.error.set(err?.error?.message ?? "Erreur lors de l'ajout de l'image");
      },
    });
  }

  supprimerImage(magasinId: string, imageId: string): void {
    this.error.set(null);

    this.repo.supprimerImage(magasinId, imageId).subscribe({
      next: () => {
        this.magasins.update(list =>
          list.map(item =>
            item.id === magasinId
              ? {
                  ...item,
                  images: item.images.filter(image => image.id !== imageId),
                  updatedAt: new Date(),
                }
              : item
          )
        );
      },
      error: err => {
        this.error.set(err?.error?.message ?? "Erreur lors de la suppression de l'image");
      },
    });
  }
}
