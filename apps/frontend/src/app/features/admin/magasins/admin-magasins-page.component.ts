import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CreerMagasinDto, MagasinDto, MagasinImageDto } from '@rdc/shared';
import { CentreFacade } from '../../../application/facades/centre.facade';
import { MagasinFacade } from '../../../application/facades/magasin.facade';

@Component({
  selector: 'app-admin-magasins-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="space-y-6">
      <section class="hero overflow-hidden rounded-[2rem] border border-base-300 bg-[linear-gradient(135deg,#ffffff_0%,#fff7ed_45%,#fde68a_110%)] shadow-sm">
        <div class="hero-content w-full flex-col items-start gap-8 px-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-10">
          <div class="max-w-3xl space-y-4">
            <span class="badge badge-outline">Administration magasins</span>
            <div class="space-y-3">
              <h1 class="text-4xl font-semibold text-base-content">Commencer le pilotage des magasins par centre.</h1>
              <p class="text-base text-base-content/65">
                Cette premiere iteration couvre le recensement des magasins, leur rattachement a un centre et leur cycle de vie.
              </p>
            </div>
          </div>

          <div class="grid w-full max-w-md gap-3 sm:grid-cols-2">
            <a class="btn btn-primary btn-lg" routerLink="/admin/centres">Voir les centres</a>
            <a class="btn btn-outline btn-lg" routerLink="/admin">Retour dashboard</a>
          </div>
        </div>
      </section>

      @if (centreFacade.error() || magasinFacade.error()) {
        <div class="alert alert-warning shadow-sm">
          <span>{{ centreFacade.error() || magasinFacade.error() }}</span>
        </div>
      }

      <section class="grid gap-4 xl:grid-cols-4">
        <article class="stats border border-base-300 bg-base-100 shadow-sm">
          <div class="stat">
            <div class="stat-title">Magasins</div>
            <div class="stat-value text-primary">{{ magasinFacade.count() }}</div>
            <div class="stat-desc">Recenses dans l'UI</div>
          </div>
        </article>
        <article class="stats border border-base-300 bg-base-100 shadow-sm">
          <div class="stat">
            <div class="stat-title">Actifs</div>
            <div class="stat-value text-success">{{ actifsCount() }}</div>
            <div class="stat-desc">Exploitables</div>
          </div>
        </article>
        <article class="stats border border-base-300 bg-base-100 shadow-sm">
          <div class="stat">
            <div class="stat-title">Inactifs</div>
            <div class="stat-value text-warning">{{ inactifsCount() }}</div>
            <div class="stat-desc">A reactiver</div>
          </div>
        </article>
        <article class="stats border border-base-300 bg-base-100 shadow-sm">
          <div class="stat">
            <div class="stat-title">Archives</div>
            <div class="stat-value text-neutral">{{ archivesCount() }}</div>
            <div class="stat-desc">Historises</div>
          </div>
        </article>
      </section>

      <article class="card border border-base-300 bg-base-100 shadow-sm">
        <div class="card-body gap-5">
          <div>
            <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">Creation</p>
            <h2 class="mt-2 text-2xl font-semibold">Ajouter un magasin</h2>
          </div>

          <form class="grid gap-4 lg:grid-cols-3" (ngSubmit)="creer()">
            <label class="form-control gap-2">
              <span class="label-text">Nom</span>
              <input class="input input-bordered" name="nom" [(ngModel)]="createForm.nom" required />
            </label>

            <label class="form-control gap-2">
              <span class="label-text">Ville</span>
              <input class="input input-bordered" name="ville" [(ngModel)]="createForm.ville" required />
            </label>

            <label class="form-control gap-2">
              <span class="label-text">Code postal</span>
              <input class="input input-bordered" name="codePostal" [(ngModel)]="createForm.codePostal" required />
            </label>

            <label class="form-control gap-2 lg:col-span-2">
              <span class="label-text">Adresse</span>
              <input class="input input-bordered" name="adresse" [(ngModel)]="createForm.adresse" required />
            </label>

            <label class="form-control gap-2">
              <span class="label-text">Centre</span>
              <select class="select select-bordered" name="centreId" [(ngModel)]="createForm.centreId" required>
                <option value="" disabled>Choisir un centre</option>
                @for (centre of centreFacade.centres(); track centre.id) {
                  <option [value]="centre.id">{{ centre.nom }} - {{ centre.ville }}</option>
                }
              </select>
            </label>

            <label class="form-control gap-2">
              <span class="label-text">Telephone</span>
              <input class="input input-bordered" name="telephone" [(ngModel)]="createForm.telephone" />
            </label>

            <label class="form-control gap-2">
              <span class="label-text">Email</span>
              <input class="input input-bordered" name="email" [(ngModel)]="createForm.email" />
            </label>

            <div class="lg:col-span-3 flex justify-end">
              <button class="btn btn-primary" type="submit" [disabled]="magasinFacade.loading() || !canCreate()">
                Creer le magasin
              </button>
            </div>
          </form>
        </div>
      </article>

      <section class="grid gap-4">
        @for (magasin of sortedMagasins(); track magasin.id) {
          <article class="card border border-base-300 bg-base-100 shadow-sm">
            <div class="card-body gap-4">
              <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">Magasin</p>
                  <h2 class="mt-2 text-2xl font-semibold">{{ magasin.nom }}</h2>
                  <p class="mt-2 text-sm text-base-content/65">
                    {{ magasin.adresse }}, {{ magasin.codePostal }} {{ magasin.ville }}
                  </p>
                  <p class="mt-1 text-sm text-base-content/55">Centre: {{ nomCentre(magasin.centreId) }}</p>
                </div>

                <div class="flex flex-wrap gap-2">
                  <span class="badge badge-outline">{{ magasin.statut }}</span>
                  @if (magasin.statut === 'ACTIF') {
                    <button class="btn btn-sm btn-warning" type="button" (click)="desactiver(magasin.id)">Desactiver</button>
                  }
                  @if (magasin.statut === 'INACTIF') {
                    <button class="btn btn-sm btn-success" type="button" (click)="activer(magasin.id)">Reactiver</button>
                  }
                  @if (magasin.statut !== 'ARCHIVE') {
                    <button class="btn btn-sm btn-outline" type="button" (click)="archiver(magasin.id)">Archiver</button>
                  }
                </div>
              </div>

              <div class="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div class="space-y-3">
                  <div class="rounded-2xl border border-base-300 bg-base-200/40 p-4">
                    <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">Contact</p>
                    <p class="mt-2 text-sm font-medium">{{ magasin.email || 'Email non renseigne' }}</p>
                    <p class="mt-1 text-sm text-base-content/65">{{ magasin.telephone || 'Telephone non renseigne' }}</p>
                  </div>

                  <label class="form-control gap-2">
                    <span class="label-text">Ajouter une image</span>
                    <input
                      type="file"
                      class="file-input file-input-bordered w-full"
                      accept="image/*"
                      (change)="onImageSelected($event, magasin.id)" />
                  </label>
                </div>

                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">Galerie</p>
                    <span class="badge badge-ghost">{{ magasin.images.length }} image(s)</span>
                  </div>

                  @if (magasin.images.length) {
                    <div class="grid gap-3 sm:grid-cols-2">
                      @for (image of sortedImages(magasin); track image.id) {
                        <article class="rounded-2xl border border-base-300 bg-base-100 p-3 shadow-sm">
                          <img
                            class="h-36 w-full rounded-xl object-cover"
                            [src]="image.url"
                            [alt]="'Image ' + magasin.nom" />
                          <div class="mt-3 flex items-center justify-between gap-3 text-xs text-base-content/55">
                            <span>Ordre {{ image.ordre }}</span>
                            <button
                              class="btn btn-xs btn-outline btn-error"
                              type="button"
                              (click)="supprimerImage(magasin.id, image.id)">
                              Supprimer
                            </button>
                          </div>
                        </article>
                      }
                    </div>
                  } @else {
                    <div class="rounded-2xl border border-dashed border-base-300 p-4 text-sm text-base-content/60">
                      Aucune image pour ce magasin.
                    </div>
                  }
                </div>
              </div>
            </div>
          </article>
        } @empty {
          <div class="rounded-2xl border border-dashed border-base-300 p-8 text-sm text-base-content/60">
            Aucun magasin pour le moment. Tu peux commencer par en rattacher un a un centre.
          </div>
        }
      </section>
    </section>
  `,
})
export class AdminMagasinsPageComponent implements OnInit {
  readonly centreFacade = inject(CentreFacade);
  readonly magasinFacade = inject(MagasinFacade);
  private readonly loadedCentreIdsKey = signal('');

  readonly actifsCount = computed(() => this.magasinFacade.magasins().filter(magasin => magasin.statut === 'ACTIF').length);
  readonly inactifsCount = computed(() => this.magasinFacade.magasins().filter(magasin => magasin.statut === 'INACTIF').length);
  readonly archivesCount = computed(() => this.magasinFacade.magasins().filter(magasin => magasin.statut === 'ARCHIVE').length);
  readonly sortedMagasins = computed(() =>
    [...this.magasinFacade.magasins()].sort((a, b) =>
      a.centreId.localeCompare(b.centreId) || a.nom.localeCompare(b.nom)
    )
  );

  readonly createForm: CreerMagasinDto = {
    nom: '',
    ville: '',
    codePostal: '',
    adresse: '',
    telephone: '',
    email: '',
    centreId: '',
  };

  constructor() {
    effect(() => {
      const centreIds = this.centreFacade.centres().map(centre => centre.id).sort();
      const key = centreIds.join(',');

      if (!key || key === this.loadedCentreIdsKey()) {
        return;
      }

      this.loadedCentreIdsKey.set(key);
      this.magasinFacade.charger({ centreIds });
    });
  }

  ngOnInit(): void {
    this.centreFacade.charger();
  }

  canCreate(): boolean {
    return Boolean(
      this.createForm.nom.trim() &&
      this.createForm.ville.trim() &&
      this.createForm.codePostal.trim() &&
      this.createForm.adresse.trim() &&
      this.createForm.centreId.trim()
    );
  }

  creer(): void {
    if (!this.canCreate()) {
      return;
    }

    this.magasinFacade.creer({
      nom: this.createForm.nom.trim(),
      ville: this.createForm.ville.trim(),
      codePostal: this.createForm.codePostal.trim(),
      adresse: this.createForm.adresse.trim(),
      telephone: this.createForm.telephone?.trim() || undefined,
      email: this.createForm.email?.trim() || undefined,
      centreId: this.createForm.centreId,
    });

    this.createForm.nom = '';
    this.createForm.ville = '';
    this.createForm.codePostal = '';
    this.createForm.adresse = '';
    this.createForm.telephone = '';
    this.createForm.email = '';
    this.createForm.centreId = '';
  }

  desactiver(id: string): void {
    this.magasinFacade.desactiver(id);
  }

  activer(id: string): void {
    this.magasinFacade.activer(id);
  }

  archiver(id: string): void {
    this.magasinFacade.archiver(id);
  }

  onImageSelected(event: Event, magasinId: string): void {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];

    if (!file) {
      return;
    }

    this.magasinFacade.ajouterImage(magasinId, file);

    if (input) {
      input.value = '';
    }
  }

  supprimerImage(magasinId: string, imageId: string): void {
    this.magasinFacade.supprimerImage(magasinId, imageId);
  }

  nomCentre(centreId: string): string {
    return this.centreFacade.centres().find(centre => centre.id === centreId)?.nom ?? centreId;
  }

  sortedImages(magasin: MagasinDto): MagasinImageDto[] {
    return [...magasin.images].sort(
      (a, b) => a.ordre - b.ordre || new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }
}
