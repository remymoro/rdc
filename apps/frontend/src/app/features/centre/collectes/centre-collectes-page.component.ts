import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollecteFacade } from '../../../application/facades/collecte.facade';

@Component({
  selector: 'app-centre-collectes-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="space-y-6">

      <section class="hero overflow-hidden rounded-[2rem] border border-base-300 bg-[linear-gradient(135deg,#ffffff_0%,#ecfdf5_45%,#bbf7d0_110%)] shadow-sm">
        <div class="hero-content w-full flex-col items-start gap-8 px-6 py-8 lg:px-10 lg:py-10">
          <div class="max-w-3xl space-y-4">
            <span class="badge badge-outline">Collectes</span>
            <div class="space-y-3">
              <h1 class="text-4xl font-semibold text-base-content">Mes collectes et magasins participants.</h1>
              <p class="text-base text-base-content/65">
                Retrouvez les collectes pour lesquelles vos magasins ont été confirmés par l'administration.
              </p>
            </div>
          </div>
        </div>
      </section>

      @if (facade.error()) {
        <div class="alert alert-warning shadow-sm">
          <span>{{ facade.error() }}</span>
        </div>
      }

      @if (facade.loading()) {
        <div class="flex justify-center py-12">
          <span class="loading loading-spinner loading-lg"></span>
        </div>
      }

      @for (collecte of facade.participationsCentre(); track collecte.collecteId) {
        <article class="card border border-base-300 bg-base-100 shadow-sm">
          <div class="card-body gap-5">
            <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">Collecte {{ collecte.annee }}</p>
                <h2 class="mt-2 text-2xl font-semibold">{{ collecte.nom }}</h2>
                <p class="mt-2 text-sm text-base-content/65">
                  Du {{ collecte.dateDebut | date:'dd/MM/yyyy' }}
                  au {{ collecte.dateFin | date:'dd/MM/yyyy' }}
                </p>
                <p class="mt-1 text-xs text-base-content/45">
                  Saisie jusqu'au {{ collecte.dateFinSaisie | date:'dd/MM/yyyy' }}
                </p>
              </div>
              <span class="badge badge-outline self-start">{{ collecte.statut }}</span>
            </div>

            <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              @for (magasin of collecte.magasins; track magasin.magasinId) {
                <article class="rounded-2xl border border-base-300 bg-base-200/30 p-4 space-y-3">

                  @if (magasin.images.length) {
                    <img
                      [src]="magasin.images[0].url"
                      [alt]="magasin.nom"
                      class="h-28 w-full rounded-xl object-cover" />
                  } @else {
                    <div class="flex h-28 w-full items-center justify-center rounded-xl bg-base-200 text-base-content/30 text-sm">
                      Pas de photo
                    </div>
                  }

                  <div>
                    <p class="font-semibold">{{ magasin.nom }}</p>
                    <p class="mt-1 text-sm text-base-content/65">{{ magasin.adresse }}</p>
                    <p class="text-sm text-base-content/65">{{ magasin.codePostal }} {{ magasin.ville }}</p>
                  </div>

                  @if (magasin.telephone) {
                    <p class="text-xs text-base-content/55">{{ magasin.telephone }}</p>
                  }

                  <span class="badge badge-success badge-sm">{{ magasin.statutParticipation }}</span>
                </article>
              }
            </div>
          </div>
        </article>
      } @empty {
        @if (!facade.loading()) {
          <div class="rounded-2xl border border-dashed border-base-300 p-8 text-sm text-base-content/60">
            Aucune collecte avec des magasins confirmés pour le moment.
          </div>
        }
      }

    </section>
  `,
})
export class CentreCollectesPageComponent implements OnInit {
  readonly facade = inject(CollecteFacade);

  ngOnInit(): void {
    this.facade.chargerMesParticipations();
  }
}
