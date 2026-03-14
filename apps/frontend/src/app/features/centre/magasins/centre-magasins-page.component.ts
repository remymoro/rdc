import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MagasinDto, MagasinImageDto } from '@rdc/shared';
import { AuthFacade } from '../../../application/facades/auth.facade';
import { MagasinFacade } from '../../../application/facades/magasin.facade';

@Component({
  selector: 'app-centre-magasins-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="space-y-6">
      <header class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div class="space-y-2">
          <span class="badge badge-outline">Mes magasins</span>
          <h1 class="text-3xl font-semibold text-base-content">Premiere vue des magasins rattaches a votre centre</h1>
          <p class="max-w-2xl text-sm text-base-content/65">
            Cette page s'appuie maintenant sur les endpoints magasin du backend et sur la galerie d'images associee.
          </p>
        </div>
        <a class="btn btn-outline" routerLink="/centre">Retour a la vue d'ensemble</a>
      </header>

      @if (magasinFacade.error()) {
        <div class="alert alert-warning shadow-sm">
          <span>{{ magasinFacade.error() }}</span>
        </div>
      }

      <section class="grid gap-4 xl:grid-cols-3">
        <article class="stats border border-base-300 bg-base-100 shadow-sm">
          <div class="stat">
            <div class="stat-title">Magasins</div>
            <div class="stat-value text-primary">{{ magasinsDuCentre().length }}</div>
            <div class="stat-desc">Rattaches a votre centre</div>
          </div>
        </article>
        <article class="stats border border-base-300 bg-base-100 shadow-sm">
          <div class="stat">
            <div class="stat-title">Actifs</div>
            <div class="stat-value text-success">{{ actifsCount() }}</div>
            <div class="stat-desc">Prets a etre exploites</div>
          </div>
        </article>
        <article class="stats border border-base-300 bg-base-100 shadow-sm">
          <div class="stat">
            <div class="stat-title">Centre</div>
            <div class="stat-value text-lg">{{ auth.user()?.centreId || 'Non renseigne' }}</div>
            <div class="stat-desc">Perimetre courant</div>
          </div>
        </article>
      </section>

      @if (magasinFacade.loading()) {
        <div class="flex items-center justify-center py-16">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
      } @else if (magasinsDuCentre().length) {
        <section class="grid gap-4 lg:grid-cols-2">
          @for (magasin of magasinsDuCentre(); track magasin.id) {
            <article class="card border border-base-300 bg-base-100 shadow-sm">
              <div class="card-body gap-4">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">Magasin</p>
                    <h2 class="mt-2 text-2xl font-semibold">{{ magasin.nom }}</h2>
                    <p class="mt-2 text-sm text-base-content/65">
                      {{ magasin.adresse }}, {{ magasin.codePostal }} {{ magasin.ville }}
                    </p>
                  </div>
                  <span class="badge badge-outline">{{ magasin.statut }}</span>
                </div>

                <div class="grid gap-3 md:grid-cols-2">
                  <div class="rounded-2xl border border-base-300 bg-base-200/50 p-4">
                    <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">Contact</p>
                    <p class="mt-2 text-sm font-medium">{{ magasin.email || 'Email non renseigne' }}</p>
                    <p class="mt-1 text-sm text-base-content/65">{{ magasin.telephone || 'Telephone non renseigne' }}</p>
                  </div>
                  <div class="rounded-2xl border border-base-300 bg-base-200/50 p-4">
                    <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">Images</p>
                    <p class="mt-2 text-lg font-medium">{{ magasin.images.length }}</p>
                    <p class="mt-1 text-sm text-base-content/65">Photos associees au magasin</p>
                  </div>
                </div>

                @if (magasin.images.length) {
                  <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    @for (image of sortedImages(magasin); track image.id) {
                      <img
                        class="h-36 w-full rounded-2xl border border-base-300 object-cover"
                        [src]="image.url"
                        [alt]="'Image ' + magasin.nom" />
                    }
                  </div>
                }
              </div>
            </article>
          }
        </section>
      } @else {
        <div class="rounded-2xl border border-dashed border-base-300 p-8 text-sm text-base-content/60">
          Aucun magasin n'est encore rattache a votre centre dans cette premiere iteration Angular.
        </div>
      }
    </section>
  `,
})
export class CentreMagasinsPageComponent implements OnInit {
  readonly auth = inject(AuthFacade);
  readonly magasinFacade = inject(MagasinFacade);

  readonly magasinsDuCentre = computed(() => {
    const centreId = this.auth.user()?.centreId;
    if (!centreId) {
      return [];
    }

    return this.magasinFacade.magasins().filter(magasin => magasin.centreId === centreId);
  });
  readonly actifsCount = computed(() => this.magasinsDuCentre().filter(magasin => magasin.statut === 'ACTIF').length);

  ngOnInit(): void {
    const centreId = this.auth.user()?.centreId;
    if (centreId) {
      this.magasinFacade.charger({ centreId });
    }
  }

  sortedImages(magasin: MagasinDto): MagasinImageDto[] {
    return [...magasin.images].sort(
      (a, b) => a.ordre - b.ordre || new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }
}
