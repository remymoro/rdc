import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthFacade } from '../../../application/facades/auth.facade';
import { CentreFacade } from '../../../application/facades/centre.facade';

@Component({
  selector: 'app-centre-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="space-y-6">
      <header class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div class="space-y-2">
          <span class="badge badge-outline">Mon centre</span>
          <h1 class="text-3xl font-semibold text-base-content">Fiche du centre rattache a votre compte</h1>
          <p class="max-w-2xl text-sm text-base-content/65">
            Cette page se limite au centre associe a votre session pour garder un parcours simple cote responsable centre.
          </p>
        </div>
        <a class="btn btn-outline" routerLink="/centre">Retour a la vue d'ensemble</a>
      </header>

      @if (centreFacade.error()) {
        <div class="alert alert-warning shadow-sm">
          <span>{{ centreFacade.error() }}</span>
        </div>
      }

      @if (centre(); as item) {
        <div class="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <article class="card border border-base-300 bg-base-100 shadow-sm">
            <div class="card-body gap-5">
              <div class="space-y-2">
                <p class="text-xs uppercase tracking-[0.28em] text-base-content/45">Identite centre</p>
                <h2 class="text-3xl font-semibold text-base-content">{{ item.nom }}</h2>
                <p class="text-sm text-base-content/65">Derniere mise a jour: {{ item.updatedAt | date: 'dd/MM/yyyy HH:mm' }}</p>
              </div>

              <div class="grid gap-4 md:grid-cols-2">
                <article class="rounded-2xl border border-base-300 bg-base-200/50 p-4">
                  <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">Adresse</p>
                  <p class="mt-2 text-base font-medium">{{ item.adresse }}</p>
                  <p class="mt-1 text-sm text-base-content/65">{{ item.codePostal }} {{ item.ville }}</p>
                </article>
                <article class="rounded-2xl border border-base-300 bg-base-200/50 p-4">
                  <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">Contact</p>
                  <p class="mt-2 text-base font-medium">{{ item.email || 'Email non renseigne' }}</p>
                  <p class="mt-1 text-sm text-base-content/65">{{ item.telephone || 'Telephone non renseigne' }}</p>
                </article>
              </div>

              <div class="divider my-0"></div>

              <div class="rounded-[1.75rem] border border-base-300 bg-[linear-gradient(135deg,#ffffff_0%,#ecfdf5_48%,#d1fae5_100%)] p-5">
                <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">Rattachement session</p>
                <p class="mt-2 text-lg font-medium">{{ auth.user()?.email }}</p>
                <p class="mt-1 text-sm text-base-content/65">Centre associe: {{ auth.user()?.centreId || item.id }}</p>
              </div>
            </div>
          </article>

          <article class="card border border-base-300 bg-base-100 shadow-sm">
            <div class="card-body gap-4">
              <h2 class="card-title">Statut et repere</h2>

              <div class="stats stats-vertical border border-base-300 bg-base-100 shadow-sm">
                <div class="stat">
                  <div class="stat-title">Statut</div>
                  <div class="stat-value text-2xl">{{ item.statut }}</div>
                  <div class="stat-desc">Controle par l'administration</div>
                </div>
              </div>

              <div class="rounded-2xl border border-dashed border-base-300 p-4">
                <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">Identifiant technique</p>
                <p class="mt-2 break-all text-sm font-medium text-base-content/75">{{ item.id }}</p>
              </div>

              <a class="btn btn-outline" routerLink="/centre/profil">Voir mon profil</a>
            </div>
          </article>
        </div>
      } @else if (centreFacade.loading()) {
        <div class="flex items-center justify-center py-16">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
      } @else {
        <div class="alert alert-info shadow-sm">
          <span>Aucun centre n'est disponible pour ce compte.</span>
        </div>
      }
    </section>
  `,
})
export class CentreHomeComponent implements OnInit {
  readonly auth = inject(AuthFacade);
  readonly centreFacade = inject(CentreFacade);

  readonly centre = computed(() => {
    const centreId = this.auth.user()?.centreId;
    const centres = this.centreFacade.centres();

    if (centreId) {
      return centres.find(item => item.id === centreId) ?? null;
    }

    return centres[0] ?? null;
  });

  ngOnInit(): void {
    this.centreFacade.charger();
  }
}
