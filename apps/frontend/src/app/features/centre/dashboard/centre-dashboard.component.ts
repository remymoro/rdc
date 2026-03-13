import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthFacade } from '../../../application/facades/auth.facade';
import { CentreFacade } from '../../../application/facades/centre.facade';

@Component({
  selector: 'app-centre-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="space-y-6">
      <section class="hero overflow-hidden rounded-[2rem] border border-base-300 bg-[linear-gradient(135deg,#ffffff_0%,#ecfdf5_48%,#d1fae5_100%)] shadow-sm">
        <div class="hero-content w-full flex-col items-start gap-8 px-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-10">
          <div class="max-w-2xl space-y-4">
            <span class="badge badge-outline">Espace responsable centre</span>
            <div class="space-y-3">
              <h1 class="text-4xl font-semibold text-base-content">Suivez votre centre depuis un espace plus cible.</h1>
              <p class="text-base text-base-content/65">
                Les informations visibles ici sont limitees a votre centre et a votre compte, sans navigation admin parasite.
              </p>
            </div>
          </div>

          <div class="grid w-full max-w-md gap-3 sm:grid-cols-2">
            <a class="btn btn-primary btn-lg" routerLink="/centre/mon-centre">Voir mon centre</a>
            <a class="btn btn-outline btn-lg" routerLink="/centre/profil">Voir mon profil</a>
          </div>
        </div>
      </section>

      @if (centreFacade.error()) {
        <div class="alert alert-warning shadow-sm">
          <span>{{ centreFacade.error() }}</span>
        </div>
      }

      @if (currentCentre(); as centre) {
        <section class="grid gap-4 xl:grid-cols-3">
          <article class="stats border border-base-300 bg-base-100 shadow-sm">
            <div class="stat">
              <div class="stat-title">Centre</div>
              <div class="stat-value text-2xl">{{ centre.nom }}</div>
              <div class="stat-desc">{{ centre.ville }}</div>
            </div>
          </article>
          <article class="stats border border-base-300 bg-base-100 shadow-sm">
            <div class="stat">
              <div class="stat-title">Statut</div>
              <div class="stat-value text-2xl">{{ centre.statut }}</div>
              <div class="stat-desc">Mis a jour depuis l'administration</div>
            </div>
          </article>
          <article class="stats border border-base-300 bg-base-100 shadow-sm">
            <div class="stat">
              <div class="stat-title">Compte</div>
              <div class="stat-value text-lg">{{ auth.user()?.email }}</div>
              <div class="stat-desc">Acces rattache au centre</div>
            </div>
          </article>
        </section>

        <section class="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <article class="card border border-base-300 bg-base-100 shadow-sm">
            <div class="card-body gap-4">
              <div>
                <p class="text-xs uppercase tracking-[0.28em] text-base-content/45">Vue rapide</p>
                <h2 class="mt-2 text-2xl font-semibold">{{ centre.nom }}</h2>
              </div>
              <p class="text-sm leading-6 text-base-content/70">
                Votre navigation est volontairement reduite aux informations utiles pour le pilotage local du centre.
              </p>
              <div class="grid gap-3 md:grid-cols-2">
                <div class="rounded-2xl border border-base-300 bg-base-200/50 p-4">
                  <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">Localisation</p>
                  <p class="mt-2 text-lg font-medium">{{ centre.ville }} {{ centre.codePostal }}</p>
                </div>
                <div class="rounded-2xl border border-base-300 bg-base-200/50 p-4">
                  <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">Rattachement</p>
                  <p class="mt-2 text-lg font-medium">{{ auth.user()?.centreId }}</p>
                </div>
              </div>
            </div>
          </article>

          <article class="card border border-base-300 bg-base-100 shadow-sm">
            <div class="card-body gap-4">
              <h2 class="card-title">Prochaines actions</h2>
              <div class="space-y-3">
                <a class="block rounded-2xl border border-base-300 bg-base-200/40 p-4 transition hover:bg-base-200" routerLink="/centre/mon-centre">
                  <p class="font-medium">Consulter la fiche complete</p>
                  <p class="mt-2 text-sm text-base-content/60">Coordonnees, adresse et statut du centre.</p>
                </a>
                <a class="block rounded-2xl border border-base-300 bg-base-200/40 p-4 transition hover:bg-base-200" routerLink="/centre/profil">
                  <p class="font-medium">Verifier vos acces</p>
                  <p class="mt-2 text-sm text-base-content/60">Compte, role et centre associe.</p>
                </a>
              </div>
            </div>
          </article>
        </section>
      } @else if (centreFacade.loading()) {
        <div class="flex items-center justify-center py-16">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
      } @else {
        <div class="alert alert-info shadow-sm">
          <span>Aucun centre n'est rattache a ce compte.</span>
        </div>
      }
    </section>
  `,
})
export class CentreDashboardComponent implements OnInit {
  readonly auth = inject(AuthFacade);
  readonly centreFacade = inject(CentreFacade);

  readonly currentCentre = computed(() => {
    const centreId = this.auth.user()?.centreId;
    const centres = this.centreFacade.centres();

    if (centreId) {
      return centres.find(centre => centre.id === centreId) ?? null;
    }

    return centres[0] ?? null;
  });

  ngOnInit(): void {
    this.centreFacade.charger();
  }
}
