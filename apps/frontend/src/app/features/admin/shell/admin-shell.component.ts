import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthFacade } from '../../../application/facades/auth.facade';

interface AdminNavItem {
  label: string;
  description: string;
  link: string;
  exact?: boolean;
}

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div data-theme="corporate" class="min-h-screen bg-base-200 text-base-content">
      <div class="drawer lg:drawer-open">
        <input id="admin-shell-drawer" type="checkbox" class="drawer-toggle" />

        <div class="drawer-content flex min-h-screen flex-col">
          <header class="navbar sticky top-0 z-20 border-b border-base-300 bg-base-100/88 px-4 backdrop-blur lg:hidden">
            <div class="flex-none">
              <label for="admin-shell-drawer" class="btn btn-square btn-ghost" aria-label="Ouvrir la navigation admin">
                <span class="text-lg font-semibold">≡</span>
              </label>
            </div>
            <div class="flex-1">
              <span class="text-lg font-semibold">RDC Admin</span>
            </div>
            <button class="btn btn-sm btn-outline" type="button" (click)="logout()">Deconnexion</button>
          </header>

          <main class="flex-1 p-4 lg:p-8">
            <router-outlet />
          </main>
        </div>

        <div class="drawer-side z-30">
          <label for="admin-shell-drawer" class="drawer-overlay"></label>
          <aside class="flex min-h-full w-80 flex-col border-r border-base-300 bg-base-100">
            <div class="border-b border-base-300 px-6 py-6">
              <div class="rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,#0f172a_0%,#163354_55%,#0ea5e9_140%)] p-6 text-white shadow-xl">
                <p class="text-xs uppercase tracking-[0.34em] text-white/60">Administration</p>
                <h1 class="mt-3 text-2xl font-semibold">RDC</h1>
                <p class="mt-2 text-sm text-white/70">
                  Pilotage global des centres, comptes responsables et statut du reseau.
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
                <div class="card-body gap-4">
                  <div class="flex items-center gap-3">
                    <div class="avatar placeholder">
                      <div class="w-12 rounded-2xl bg-primary text-primary-content">
                        <span class="font-semibold">{{ initials() }}</span>
                      </div>
                    </div>
                    <div>
                      <p class="text-sm font-medium">{{ auth.user()?.email }}</p>
                      <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">ADMIN</p>
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
export class AdminShellComponent {
  readonly auth = inject(AuthFacade);
  private readonly router = inject(Router);

  readonly navItems: AdminNavItem[] = [
    {
      label: 'Tableau de bord',
      description: 'Vue de synthese et indicateurs du reseau',
      link: '/admin',
      exact: true,
    },
    {
      label: 'Centres',
      description: 'Creation, edition et gestion du statut des centres',
      link: '/admin/centres',
    },
    {
      label: 'Responsables',
      description: 'Comptes rattaches aux centres',
      link: '/admin/responsables',
    },
    {
      label: 'Magasins',
      description: 'Recensement et cycle de vie des magasins par centre',
      link: '/admin/magasins',
    },
    {
      label: 'Collectes',
      description: 'Pilotage des collectes annuelles et inscriptions benevoles',
      link: '/admin/collectes',
    },
    {
      label: 'Profil',
      description: 'Informations de connexion et acces',
      link: '/admin/profil',
    },
  ];

  readonly initials = computed(() => {
    const email = this.auth.user()?.email ?? '';
    return email.slice(0, 2).toUpperCase() || 'AD';
  });

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }
}
