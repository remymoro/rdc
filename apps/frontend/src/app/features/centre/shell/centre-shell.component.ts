import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthFacade } from '../../../application/facades/auth.facade';

interface CentreNavItem {
  label: string;
  description: string;
  link: string;
  exact?: boolean;
}

@Component({
  selector: 'app-centre-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div data-theme="emerald" class="min-h-screen bg-base-200 text-base-content">
      <div class="drawer lg:drawer-open">
        <input id="centre-shell-drawer" type="checkbox" class="drawer-toggle" />

        <div class="drawer-content flex min-h-screen flex-col">
          <header class="navbar sticky top-0 z-20 border-b border-base-300 bg-base-100/88 px-4 backdrop-blur lg:hidden">
            <div class="flex-none">
              <label for="centre-shell-drawer" class="btn btn-square btn-ghost" aria-label="Ouvrir la navigation centre">
                <span class="text-lg font-semibold">≡</span>
              </label>
            </div>
            <div class="flex-1">
              <span class="text-lg font-semibold">Espace centre</span>
            </div>
            <button class="btn btn-sm btn-outline" type="button" (click)="logout()">Deconnexion</button>
          </header>

          <main class="flex-1 p-4 lg:p-8">
            <router-outlet />
          </main>
        </div>

        <div class="drawer-side z-30">
          <label for="centre-shell-drawer" class="drawer-overlay"></label>
          <aside class="flex min-h-full w-80 flex-col border-r border-base-300 bg-base-100">
            <div class="border-b border-base-300 px-6 py-6">
              <div class="rounded-[2rem] border border-success/15 bg-[linear-gradient(145deg,#042f2e_0%,#065f46_55%,#34d399_140%)] p-6 text-white shadow-xl">
                <p class="text-xs uppercase tracking-[0.34em] text-white/60">Responsable centre</p>
                <h1 class="mt-3 text-2xl font-semibold">Mon espace</h1>
                <p class="mt-2 text-sm text-white/70">
                  Une vue ciblee sur votre centre, son statut et vos informations d'acces.
                </p>
              </div>
            </div>

            <div class="flex-1 space-y-6 px-4 py-5">
              <nav class="space-y-2">
                @for (item of navItems; track item.link) {
                  <a
                    class="block rounded-2xl border border-transparent px-4 py-3 transition hover:border-base-300 hover:bg-base-200"
                    [routerLink]="item.link"
                    routerLinkActive="border-base-300 bg-base-200 shadow-sm"
                    [routerLinkActiveOptions]="{ exact: item.exact ?? false }">
                    <div class="font-medium">{{ item.label }}</div>
                    <div class="mt-1 text-sm text-base-content/55">{{ item.description }}</div>
                  </a>
                }
              </nav>

              <article class="card border border-base-300 bg-base-100 shadow-sm">
                <div class="card-body gap-3">
                  <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">Centre attribue</p>
                  <p class="text-lg font-semibold">{{ auth.user()?.centreId || 'Non renseigne' }}</p>
                  <div class="flex items-center gap-3">
                    <div class="avatar placeholder">
                      <div class="w-12 rounded-2xl bg-success text-success-content">
                        <span class="font-semibold">{{ initials() }}</span>
                      </div>
                    </div>
                    <div>
                      <p class="text-sm font-medium">{{ auth.user()?.email }}</p>
                      <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">RESPONSABLE_CENTRE</p>
                    </div>
                  </div>
                  <button class="btn btn-outline btn-sm" type="button" (click)="logout()">Se deconnecter</button>
                </div>
              </article>
            </div>
          </aside>
        </div>
      </div>
    </div>
  `,
})
export class CentreShellComponent {
  readonly auth = inject(AuthFacade);
  private readonly router = inject(Router);

  readonly navItems: CentreNavItem[] = [
    {
      label: 'Vue d ensemble',
      description: 'Resume rapide de votre centre et de son statut',
      link: '/centre',
      exact: true,
    },
    {
      label: 'Mon centre',
      description: 'Fiche detaillee du centre rattache a votre compte',
      link: '/centre/mon-centre',
    },
    {
      label: 'Mes magasins',
      description: 'Premiere vue des magasins rattaches a votre centre',
      link: '/centre/magasins',
    },
    {
      label: 'Collectes',
      description: 'Magasins confirmés pour chaque collecte annuelle',
      link: '/centre/collectes',
    },
    {
      label: 'Profil',
      description: 'Informations de connexion et rattachement',
      link: '/centre/profil',
    },
  ];

  readonly initials = computed(() => {
    const email = this.auth.user()?.email ?? '';
    return email.slice(0, 2).toUpperCase() || 'RC';
  });

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }
}
