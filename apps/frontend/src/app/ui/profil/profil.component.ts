import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthFacade } from '../../application/facades/auth.facade';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="space-y-6">
      <header class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div class="space-y-2">
          <span class="badge badge-outline">{{ auth.isAdmin() ? 'Administrateur' : 'Responsable centre' }}</span>
          <h1 class="text-3xl font-semibold text-base-content">Mon profil</h1>
          <p class="max-w-2xl text-sm text-base-content/65">
            Informations de connexion et rattachement utilisées pour sécuriser votre espace.
          </p>
        </div>
        <a class="btn btn-outline" [routerLink]="auth.homeUrl()">Retour au tableau de bord</a>
      </header>

      <div class="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <article class="card border border-base-300 bg-base-100 shadow-sm">
          <div class="card-body gap-5">
            <div class="flex items-start gap-4">
              <div class="avatar placeholder">
                <div class="w-16 rounded-2xl bg-primary text-primary-content">
                  <span class="text-xl font-semibold">{{ initials() }}</span>
                </div>
              </div>
              <div class="space-y-1">
                <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">Compte</p>
                <h2 class="text-2xl font-semibold text-base-content">{{ auth.user()?.email }}</h2>
                <p class="text-sm text-base-content/65">Rôle: {{ auth.user()?.role || 'N/A' }}</p>
              </div>
            </div>

            <div class="divider my-0"></div>

            <div class="grid gap-4 sm:grid-cols-2">
              <article class="rounded-2xl border border-base-300 bg-base-200/50 p-4">
                <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">Accès principal</p>
                <p class="mt-2 text-lg font-medium">{{ auth.homeUrl() }}</p>
              </article>
              <article class="rounded-2xl border border-base-300 bg-base-200/50 p-4">
                <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">Statut session</p>
                <p class="mt-2 text-lg font-medium">{{ auth.isAuthenticated() ? 'Connecte' : 'Deconnecte' }}</p>
              </article>
            </div>
          </div>
        </article>

        <article class="card border border-base-300 bg-base-100 shadow-sm">
          <div class="card-body gap-4">
            <h2 class="card-title">Rattachement</h2>
            <p class="text-sm text-base-content/65">
              Cet identifiant détermine le périmètre visible dans l'espace responsable centre.
            </p>

            <div class="rounded-2xl border border-dashed border-base-300 bg-base-200/40 p-5">
              <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">Centre attribue</p>
              <p class="mt-2 text-xl font-semibold text-base-content">
                {{ auth.user()?.centreId || 'Aucun centre associe' }}
              </p>
            </div>

            <div class="stats stats-vertical border border-base-300 bg-base-100 shadow-sm">
              <div class="stat">
                <div class="stat-title">Type de compte</div>
                <div class="stat-value text-2xl">{{ accountLabel() }}</div>
                <div class="stat-desc">Utilise pour router vers le bon espace</div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  `,
})
export class ProfilComponent {
  readonly auth = inject(AuthFacade);
  readonly accountLabel = computed(() => this.auth.isAdmin() ? 'Global' : 'Centre');

  readonly initials = computed(() => {
    const email = this.auth.user()?.email ?? '';
    return email.slice(0, 2).toUpperCase() || 'RD';
  });
}
