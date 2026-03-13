import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthFacade } from '../../../application/facades/auth.facade';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div
      data-theme="corporate"
      class="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(17,25,40,0.18),_transparent_35%),linear-gradient(160deg,#06121f_0%,#10233d_45%,#f3f7fb_45%,#eef3f8_100%)]">
      <div class="mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-10 lg:px-10">
        <div class="grid w-full items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section class="hidden lg:block text-white">
            <div class="max-w-xl space-y-6">
              <span class="badge badge-lg border-white/20 bg-white/10 text-white">RDC Front Office</span>
              <div class="space-y-4">
                <h1 class="text-5xl font-semibold leading-tight">Un accès distinct pour l'admin et chaque responsable centre.</h1>
                <p class="text-lg text-white/72">
                  Une navigation claire, un shell moderne et des écrans métier séparés pour éviter les interfaces mixtes.
                </p>
              </div>
              <div class="grid gap-4 sm:grid-cols-2">
                <article class="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                  <p class="text-sm uppercase tracking-[0.28em] text-white/55">Admin</p>
                  <p class="mt-3 text-xl font-medium">Pilotage des centres, comptes responsables et activité globale.</p>
                </article>
                <article class="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                  <p class="text-sm uppercase tracking-[0.28em] text-white/55">Responsable</p>
                  <p class="mt-3 text-xl font-medium">Vue centrée sur votre centre, son statut et vos informations d'accès.</p>
                </article>
              </div>
            </div>
          </section>

          <section class="card border border-base-300 bg-base-100/86 shadow-2xl backdrop-blur">
            <div class="card-body gap-6 p-7 sm:p-10">
              <div class="space-y-2">
                <span class="badge badge-outline">Connexion</span>
                <h2 class="text-3xl font-semibold text-base-content">RDC</h2>
                <p class="text-sm text-base-content/65">
                  Connectez-vous pour ouvrir votre espace de gestion.
                </p>
              </div>

              @if (auth.error()) {
                <div class="alert alert-error shadow-sm">
                  <span>{{ auth.error() }}</span>
                </div>
              }

              <form class="space-y-4" (ngSubmit)="submit()">
                <label class="form-control w-full gap-2">
                  <span class="label-text font-medium text-base-content/75">Email</span>
                  <input
                    type="email"
                    class="input input-bordered input-lg w-full"
                    [(ngModel)]="email"
                    name="email"
                    required
                    autocomplete="email"
                    placeholder="admin@rdc.fr" />
                </label>

                <label class="form-control w-full gap-2">
                  <span class="label-text font-medium text-base-content/75">Mot de passe</span>
                  <input
                    type="password"
                    class="input input-bordered input-lg w-full"
                    [(ngModel)]="password"
                    name="password"
                    required
                    autocomplete="current-password"
                    placeholder="Votre mot de passe" />
                </label>

                <button type="submit" class="btn btn-primary btn-lg w-full" [disabled]="auth.loading()">
                  @if (auth.loading()) {
                    <span class="loading loading-spinner loading-sm"></span>
                  }
                  <span>Se connecter</span>
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  readonly auth = inject(AuthFacade);
  private readonly router = inject(Router);

  email = '';
  password = '';
  private readonly redirectTo = signal<string | null>(null);

  constructor() {
    this.auth.clearError();

    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirectTo');
    if (redirect && redirect.startsWith('/') && redirect !== '/login') {
      this.redirectTo.set(redirect);
    }

    effect(() => {
      if (this.auth.isAuthenticated()) {
        void this.router.navigateByUrl(this.redirectTo() ?? this.auth.homeUrl());
      }
    });
  }

  submit(): void {
    this.auth.clearError();
    this.auth.login({ email: this.email, password: this.password });
  }
}
