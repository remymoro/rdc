import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CentreListComponent } from '../../../ui/centres/centre-list/centre-list.component';

@Component({
  selector: 'app-admin-centres-page',
  standalone: true,
  imports: [RouterLink, CentreListComponent],
  template: `
    <section class="space-y-6">
      <section class="hero overflow-hidden rounded-[2rem] border border-base-300 bg-[linear-gradient(135deg,#ffffff_0%,#edf3fb_45%,#dbeafe_100%)] shadow-sm">
        <div class="hero-content w-full flex-col items-start gap-8 px-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-10">
          <div class="max-w-3xl space-y-4">
            <span class="badge badge-outline">Administration centres</span>
            <div class="space-y-3">
              <h1 class="text-4xl font-semibold text-base-content">Structurez le reseau des centres depuis l'espace admin.</h1>
              <p class="text-base text-base-content/65">
                Cette page centralise la creation, la modification et la gestion des statuts pour tous les centres du reseau.
              </p>
            </div>
          </div>

          <div class="grid w-full max-w-md gap-3 sm:grid-cols-2">
            <a class="btn btn-primary btn-lg" routerLink="/admin/responsables">Voir les responsables</a>
            <a class="btn btn-outline btn-lg" routerLink="/admin">Retour dashboard</a>
          </div>
        </div>
      </section>

      <article class="grid gap-4 lg:grid-cols-3">
        <div class="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">Creation</p>
          <p class="mt-2 text-sm leading-6 text-base-content/70">
            Ajoutez un nouveau centre avant de rattacher un responsable centre.
          </p>
        </div>
        <div class="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">Cycle de vie</p>
          <p class="mt-2 text-sm leading-6 text-base-content/70">
            Activez, desactivez ou archivez un centre selon son etat operationnel.
          </p>
        </div>
        <div class="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">Rattachement</p>
          <p class="mt-2 text-sm leading-6 text-base-content/70">
            Un responsable centre doit toujours etre associe a un centre existant.
          </p>
        </div>
      </article>

      <app-centre-list />
    </section>
  `,
})
export class AdminCentresPageComponent {}
