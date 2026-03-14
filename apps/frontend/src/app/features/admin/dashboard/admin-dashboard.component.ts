import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthFacade } from '../../../application/facades/auth.facade';
import { CentreFacade } from '../../../application/facades/centre.facade';
import { ResponsableCentreFacade } from '../../../application/facades/responsable-centre.facade';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="space-y-6">
      <section class="hero overflow-hidden rounded-[2rem] border border-base-300 bg-[linear-gradient(135deg,#ffffff_0%,#edf3fb_45%,#dbeafe_100%)] shadow-sm">
        <div class="hero-content w-full flex-col items-start gap-8 px-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-10">
          <div class="max-w-2xl space-y-4">
            <span class="badge badge-outline">Administration centrale</span>
            <div class="space-y-3">
              <h1 class="text-4xl font-semibold text-base-content">Pilotez l'ensemble des centres depuis un espace unifie.</h1>
              <p class="text-base text-base-content/65">
                Centres, responsables et statuts critiques sont accessibles depuis le meme shell, avec une navigation plus claire par role.
              </p>
            </div>
          </div>

          <div class="grid w-full max-w-xl gap-3 sm:grid-cols-3">
            <a class="btn btn-primary btn-lg" routerLink="/admin/centres">Gerer les centres</a>
            <a class="btn btn-outline btn-lg" routerLink="/admin/responsables">Gerer les responsables</a>
            <a class="btn btn-outline btn-lg" routerLink="/admin/magasins">Gerer les magasins</a>
          </div>
        </div>
      </section>

      @if (centreFacade.error() || responsableFacade.error()) {
        <div class="alert alert-warning shadow-sm">
          <span>{{ centreFacade.error() || responsableFacade.error() }}</span>
        </div>
      }

      <section class="grid gap-4 xl:grid-cols-4">
        <article class="stats border border-base-300 bg-base-100 shadow-sm">
          <div class="stat">
            <div class="stat-title">Centres</div>
            <div class="stat-value text-primary">{{ centreFacade.count() }}</div>
            <div class="stat-desc">Reseau total</div>
          </div>
        </article>

        <article class="stats border border-base-300 bg-base-100 shadow-sm">
          <div class="stat">
            <div class="stat-title">Centres actifs</div>
            <div class="stat-value text-success">{{ activeCentres() }}</div>
            <div class="stat-desc">Exploitables immediatement</div>
          </div>
        </article>

        <article class="stats border border-base-300 bg-base-100 shadow-sm">
          <div class="stat">
            <div class="stat-title">Centres inactifs</div>
            <div class="stat-value text-warning">{{ inactiveCentres() }}</div>
            <div class="stat-desc">A surveiller</div>
          </div>
        </article>

        <article class="stats border border-base-300 bg-base-100 shadow-sm">
          <div class="stat">
            <div class="stat-title">Responsables actifs</div>
            <div class="stat-value text-secondary">{{ activeResponsables() }}</div>
            <div class="stat-desc">Comptes operationnels</div>
          </div>
        </article>
      </section>

      <section class="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <article class="card border border-base-300 bg-base-100 shadow-sm">
          <div class="card-body gap-5">
            <div>
              <p class="text-xs uppercase tracking-[0.28em] text-base-content/45">Actions prioritaires</p>
              <h2 class="mt-2 text-2xl font-semibold">Parcours admin</h2>
            </div>
            <div class="grid gap-3 md:grid-cols-3">
              <a class="rounded-2xl border border-base-300 bg-base-200/40 p-4 transition hover:bg-base-200" routerLink="/admin/centres">
                <p class="font-medium">Structurer le reseau</p>
                <p class="mt-2 text-sm text-base-content/60">Creer, modifier, activer ou archiver les centres.</p>
              </a>
              <a class="rounded-2xl border border-base-300 bg-base-200/40 p-4 transition hover:bg-base-200" routerLink="/admin/responsables">
                <p class="font-medium">Gerer les responsables</p>
                <p class="mt-2 text-sm text-base-content/60">Associer les comptes au bon centre et controler leur statut.</p>
              </a>
              <a class="rounded-2xl border border-base-300 bg-base-200/40 p-4 transition hover:bg-base-200" routerLink="/admin/magasins">
                <p class="font-medium">Recenser les magasins</p>
                <p class="mt-2 text-sm text-base-content/60">Poser le premier catalogue magasin par centre avant la suite du domaine.</p>
              </a>
              <a class="rounded-2xl border border-base-300 bg-base-200/40 p-4 transition hover:bg-base-200" routerLink="/admin/profil">
                <p class="font-medium">Verifier vos acces</p>
                <p class="mt-2 text-sm text-base-content/60">Consulter votre compte et votre role technique.</p>
              </a>
            </div>
          </div>
        </article>

        <article class="card border border-base-300 bg-base-100 shadow-sm">
          <div class="card-body gap-4">
            <div>
              <p class="text-xs uppercase tracking-[0.28em] text-base-content/45">Session</p>
              <h2 class="mt-2 text-2xl font-semibold">{{ auth.user()?.email }}</h2>
            </div>
            <div class="rounded-2xl border border-base-300 bg-base-200/50 p-4">
              <p class="text-sm text-base-content/60">Role courant</p>
              <p class="mt-2 text-lg font-medium">{{ auth.user()?.role }}</p>
            </div>
            <div class="rounded-2xl border border-dashed border-base-300 p-4">
              <p class="text-sm text-base-content/60">Architecture front</p>
              <p class="mt-2 text-sm leading-6 text-base-content/75">
                Un shell admin, un shell responsable centre, et des routes distinctes pour reduire les ecrans mixtes.
              </p>
            </div>
          </div>
        </article>
      </section>
    </section>
  `,
})
export class AdminDashboardComponent implements OnInit {
  readonly auth = inject(AuthFacade);
  readonly centreFacade = inject(CentreFacade);
  readonly responsableFacade = inject(ResponsableCentreFacade);

  readonly activeCentres = computed(() =>
    this.centreFacade.centres().filter(centre => centre.statut === 'ACTIF').length
  );
  readonly inactiveCentres = computed(() =>
    this.centreFacade.centres().filter(centre => centre.statut === 'INACTIF').length
  );
  readonly activeResponsables = computed(() =>
    this.responsableFacade.responsables().filter(responsable => responsable.isActive).length
  );

  ngOnInit(): void {
    this.centreFacade.charger();
    this.responsableFacade.charger();
  }
}
