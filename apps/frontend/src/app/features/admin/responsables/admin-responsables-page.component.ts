import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ResponsableListComponent } from '../../../ui/responsables/responsable-list/responsable-list.component';

@Component({
  selector: 'app-admin-responsables-page',
  standalone: true,
  imports: [RouterLink, ResponsableListComponent],
  template: `
    <section class="space-y-6">
      <section class="hero overflow-hidden rounded-[2rem] border border-base-300 bg-[linear-gradient(135deg,#ffffff_0%,#eefbf6_45%,#dcfce7_100%)] shadow-sm">
        <div class="hero-content w-full flex-col items-start gap-8 px-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-10">
          <div class="max-w-3xl space-y-4">
            <span class="badge badge-outline">Administration responsables</span>
            <div class="space-y-3">
              <h1 class="text-4xl font-semibold text-base-content">L'admin cree et rattache un responsable a un centre.</h1>
              <p class="text-base text-base-content/65">
                Le compte responsable centre est cree par l'administration, avec un email, un mot de passe initial et un centre de rattachement.
              </p>
            </div>
          </div>

          <div class="grid w-full max-w-md gap-3 sm:grid-cols-2">
            <a class="btn btn-primary btn-lg" routerLink="/admin/centres">Voir les centres</a>
            <a class="btn btn-outline btn-lg" routerLink="/admin">Retour dashboard</a>
          </div>
        </div>
      </section>

      <article class="grid gap-4 lg:grid-cols-3">
        <div class="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">Etape 1</p>
          <p class="mt-2 text-sm leading-6 text-base-content/70">
            Selectionner le centre auquel le compte responsable doit etre rattache.
          </p>
        </div>
        <div class="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">Etape 2</p>
          <p class="mt-2 text-sm leading-6 text-base-content/70">
            Definir un email unique et un mot de passe initial pour la premiere connexion.
          </p>
        </div>
        <div class="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">Etape 3</p>
          <p class="mt-2 text-sm leading-6 text-base-content/70">
            Modifier, desactiver ou supprimer le compte si le rattachement evolue.
          </p>
        </div>
      </article>

      <app-responsable-list />
    </section>
  `,
})
export class AdminResponsablesPageComponent {}
