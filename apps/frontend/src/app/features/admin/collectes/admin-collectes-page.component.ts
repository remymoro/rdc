import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CollecteFacade } from '../../../application/facades/collecte.facade';
import { MagasinFacade } from '../../../application/facades/magasin.facade';
import { CentreFacade } from '../../../application/facades/centre.facade';
import { CreerCollecteDto } from '../../../application/ports/collecte.repository';

@Component({
  selector: 'app-admin-collectes-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="space-y-6">

      <section class="hero overflow-hidden rounded-[2rem] border border-base-300 bg-[linear-gradient(135deg,#ffffff_0%,#eff6ff_45%,#bfdbfe_110%)] shadow-sm">
        <div class="hero-content w-full flex-col items-start gap-8 px-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-10">
          <div class="max-w-3xl space-y-4">
            <span class="badge badge-outline">Administration collectes</span>
            <div class="space-y-3">
              <h1 class="text-4xl font-semibold text-base-content">Pilotage des collectes annuelles.</h1>
              <p class="text-base text-base-content/65">
                Créez et gérez les collectes des Restos du Cœur. Définissez les périodes, ouvrez les inscriptions et associez les magasins participants.
              </p>
            </div>
          </div>
          <article class="stats border border-base-300 bg-base-100 shadow-sm">
            <div class="stat">
              <div class="stat-title">Collectes</div>
              <div class="stat-value text-primary">{{ collecteFacade.count() }}</div>
              <div class="stat-desc">Enregistrées</div>
            </div>
          </article>
        </div>
      </section>

      @if (collecteFacade.error()) {
        <div class="alert alert-warning shadow-sm">
          <span>{{ collecteFacade.error() }}</span>
        </div>
      }

      <!-- Création -->
      <article class="card border border-base-300 bg-base-100 shadow-sm">
        <div class="card-body gap-5">
          <div>
            <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">Création</p>
            <h2 class="mt-2 text-2xl font-semibold">Nouvelle collecte</h2>
          </div>

          <form class="grid gap-4 lg:grid-cols-2" (ngSubmit)="creer()">
            <label class="form-control gap-2 lg:col-span-2">
              <span class="label-text">Nom de la collecte</span>
              <input
                class="input input-bordered"
                name="nom"
                placeholder="Collecte des Restos 2026"
                [(ngModel)]="createForm.nom"
                required />
            </label>

            <label class="form-control gap-2">
              <span class="label-text">Date de début</span>
              <input
                class="input input-bordered"
                type="date"
                name="dateDebut"
                [(ngModel)]="createForm.dateDebut"
                required />
            </label>

            <label class="form-control gap-2">
              <span class="label-text">Date de fin</span>
              <input
                class="input input-bordered"
                type="date"
                name="dateFin"
                [(ngModel)]="createForm.dateFin"
                required />
            </label>

            <label class="form-control gap-2 lg:col-span-2">
              <span class="label-text">Fin de saisie (tolérance)</span>
              <input
                class="input input-bordered"
                type="date"
                name="dateFinSaisie"
                [(ngModel)]="createForm.dateFinSaisie"
                required />
              <span class="label-text text-base-content/55 text-xs">Délai après la collecte pour finaliser la saisie des données</span>
            </label>

            <div class="lg:col-span-2 flex justify-end">
              <button
                class="btn btn-primary"
                type="submit"
                [disabled]="collecteFacade.loading() || !canCreate()">
                Créer la collecte
              </button>
            </div>
          </form>
        </div>
      </article>

      <!-- Liste -->
      <section class="grid gap-4">
        @for (collecte of collecteFacade.collectes(); track collecte.id) {
          <article class="card border border-base-300 bg-base-100 shadow-sm">
            <div class="card-body gap-4">
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

                <div class="flex flex-wrap items-center gap-2">
                  <span class="badge badge-outline">{{ collecte.statut }}</span>
                  @if (collecte.statut === 'PREPARATION') {
                    <button
                      class="btn btn-sm btn-primary"
                      type="button"
                      (click)="ouvrirInscriptions(collecte.id)">
                      Ouvrir les inscriptions
                    </button>
                  }
                </div>
              </div>

              <!-- Participations magasins -->
              <div class="rounded-2xl border border-base-300 bg-base-200/40 p-4 space-y-3">
                <div class="flex items-center justify-between">
                  <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">Magasins participants</p>
                  <span class="badge badge-ghost">{{ collecte.participations.length }}</span>
                </div>

                @if (collecte.statut === 'PREPARATION') {
                  <div class="flex gap-2">
                    <select
                      class="select select-bordered select-sm flex-1"
                      [(ngModel)]="magasinSelectionne[collecte.id]">
                      <option value="">Ajouter un magasin...</option>
                      @for (magasin of magasinsFiltres(collecte.id); track magasin.id) {
                        <option [value]="magasin.id">{{ magasin.nom }} — {{ magasin.ville }}</option>
                      }
                    </select>
                    <button
                      class="btn btn-sm btn-outline"
                      type="button"
                      [disabled]="!magasinSelectionne[collecte.id]"
                      (click)="ajouterMagasin(collecte.id)">
                      Ajouter
                    </button>
                  </div>
                }

                @if (collecte.participations.length) {
                  <ul class="grid gap-2 sm:grid-cols-2">
                    @for (participation of collecte.participations; track participation.magasinId) {
                      <li class="flex items-center justify-between rounded-xl border border-base-300 bg-base-100 px-3 py-2 text-sm">
                        <span>{{ nomMagasin(participation.magasinId) }}</span>
                        <span class="badge badge-sm badge-outline">{{ participation.statut }}</span>
                      </li>
                    }
                  </ul>
                } @else {
                  <p class="text-sm text-base-content/50">Aucun magasin ajouté pour le moment.</p>
                }
              </div>
            </div>
          </article>
        } @empty {
          <div class="rounded-2xl border border-dashed border-base-300 p-8 text-sm text-base-content/60">
            Aucune collecte pour le moment. Créez la première collecte ci-dessus.
          </div>
        }
      </section>

    </section>
  `,
})
export class AdminCollectesPageComponent implements OnInit {
  readonly collecteFacade = inject(CollecteFacade);
  readonly magasinFacade = inject(MagasinFacade);
  readonly centreFacade = inject(CentreFacade);

  readonly createForm: CreerCollecteDto = {
    nom: '',
    dateDebut: '',
    dateFin: '',
    dateFinSaisie: '',
  };

  readonly magasinSelectionne: Record<string, string> = {};

  ngOnInit(): void {
    this.collecteFacade.charger();
    this.centreFacade.charger();
  }

  canCreate(): boolean {
    return Boolean(
      this.createForm.nom.trim() &&
      this.createForm.dateDebut &&
      this.createForm.dateFin &&
      this.createForm.dateFinSaisie
    );
  }

  creer(): void {
    if (!this.canCreate()) return;

    this.collecteFacade.creer({ ...this.createForm });

    this.createForm.nom = '';
    this.createForm.dateDebut = '';
    this.createForm.dateFin = '';
    this.createForm.dateFinSaisie = '';
  }

  ouvrirInscriptions(id: string): void {
    this.collecteFacade.ouvrirInscriptions(id);
  }

  ajouterMagasin(collecteId: string): void {
    const magasinId = this.magasinSelectionne[collecteId];
    if (!magasinId) return;

    this.collecteFacade.ajouterMagasin(collecteId, magasinId);
    this.magasinSelectionne[collecteId] = '';
  }

  magasinsFiltres(collecteId: string) {
    const collecte = this.collecteFacade.collectes().find(c => c.id === collecteId);
    const dejaDedans = collecte?.participations.map(p => p.magasinId) ?? [];
    return this.magasinFacade.magasins().filter(
      m => m.statut === 'ACTIF' && !dejaDedans.includes(m.id)
    );
  }

  nomMagasin(magasinId: string): string {
    return this.magasinFacade.magasins().find(m => m.id === magasinId)?.nom ?? magasinId;
  }
}
