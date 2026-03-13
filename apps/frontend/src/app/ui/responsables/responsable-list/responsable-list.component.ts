import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CreerResponsableCentreDto,
  ModifierResponsableCentreDto,
  ResponsableCentreDto,
} from '@rdc/shared';
import { CentreFacade } from '../../../application/facades/centre.facade';
import { ResponsableCentreFacade } from '../../../application/facades/responsable-centre.facade';

@Component({
  selector: 'app-responsable-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="space-y-6">
      @if (facade.error()) {
        <div class="alert alert-error shadow-sm">
          <span>{{ facade.error() }}</span>
          <button class="btn btn-ghost btn-xs" type="button" (click)="facade.clearFeedback()">Fermer</button>
        </div>
      }

      @if (facade.success()) {
        <div class="alert alert-success shadow-sm">
          <span>{{ facade.success() }}</span>
          <button class="btn btn-ghost btn-xs" type="button" (click)="facade.clearFeedback()">Fermer</button>
        </div>
      }

      <section class="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <article class="card border border-base-300 bg-base-100 shadow-sm">
          <div class="card-body gap-5">
            <div class="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">Creation</p>
                <h2 class="mt-2 text-2xl font-semibold text-base-content">Creer un responsable centre</h2>
                <p class="mt-2 max-w-2xl text-sm leading-6 text-base-content/65">
                  L'admin attribue le compte a un centre existant, fournit l'email de connexion et definit un mot de passe initial.
                </p>
              </div>
              <div class="badge badge-outline">{{ facade.count() }} compte(s)</div>
            </div>

            <form class="grid gap-4 lg:grid-cols-4" (ngSubmit)="creer()">
              <div class="form-control gap-2 lg:col-span-2">
                <label for="create-responsable-email" class="label-text font-medium text-base-content/70">Email</label>
                <input
                  id="create-responsable-email"
                  type="email"
                  class="input input-bordered w-full"
                  name="email"
                  [(ngModel)]="createForm.email"
                  placeholder="responsable@centre.fr"
                  required />
              </div>

              <div class="form-control gap-2">
                <label for="create-responsable-password" class="label-text font-medium text-base-content/70">Mot de passe initial</label>
                <input
                  id="create-responsable-password"
                  type="password"
                  class="input input-bordered w-full"
                  name="password"
                  [(ngModel)]="createForm.password"
                  placeholder="Mot de passe"
                  required />
              </div>

              <div class="form-control gap-2">
                <label for="create-responsable-centre" class="label-text font-medium text-base-content/70">Centre</label>
                <select
                  id="create-responsable-centre"
                  class="select select-bordered w-full"
                  name="centreId"
                  [(ngModel)]="createForm.centreId"
                  required>
                  <option value="" disabled>Choisir un centre</option>
                  @for (centre of centres(); track centre.id) {
                    <option [value]="centre.id">{{ centre.nom }} - {{ centre.ville }}</option>
                  }
                </select>
              </div>

              <div class="lg:col-span-4 flex flex-wrap items-center justify-between gap-3">
                <p class="text-sm text-base-content/55">
                  Un responsable centre reste modifiable apres creation: email, centre de rattachement et statut.
                </p>
                <button class="btn btn-primary" type="submit" [disabled]="facade.submitting() || !canCreate()">
                  @if (facade.submitting()) {
                    <span class="loading loading-spinner loading-sm"></span>
                  }
                  <span>Creer le responsable</span>
                </button>
              </div>
            </form>
          </div>
        </article>

        <article class="card border border-base-300 bg-base-100 shadow-sm">
          <div class="card-body gap-4">
            <div>
              <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">Lecture</p>
              <h2 class="mt-2 text-2xl font-semibold text-base-content">Compte selectionne</h2>
            </div>

            @if (selectedResponsable(); as responsable) {
              <div class="rounded-[1.75rem] border border-base-300 bg-[linear-gradient(135deg,#ffffff_0%,#eff6ff_48%,#dbeafe_100%)] p-5">
                <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">Email</p>
                <p class="mt-2 text-xl font-semibold text-base-content">{{ responsable.email }}</p>
                <p class="mt-2 text-sm text-base-content/65">
                  Centre: {{ nomCentre(responsable.centreId) }}
                </p>
              </div>

              <div class="grid gap-3 sm:grid-cols-2">
                <div class="rounded-2xl border border-base-300 bg-base-200/40 p-4">
                  <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">Statut</p>
                  <p class="mt-2 text-lg font-medium">{{ responsable.isActive ? 'ACTIF' : 'INACTIF' }}</p>
                </div>
                <div class="rounded-2xl border border-base-300 bg-base-200/40 p-4">
                  <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">Centre ID</p>
                  <p class="mt-2 break-all text-sm font-medium text-base-content/75">{{ responsable.centreId }}</p>
                </div>
              </div>

              <div class="stats stats-vertical border border-base-300 bg-base-100 shadow-sm">
                <div class="stat">
                  <div class="stat-title">Creation</div>
                  <div class="stat-value text-lg">{{ responsable.createdAt | date: 'dd/MM/yyyy' }}</div>
                  <div class="stat-desc">Derniere mise a jour {{ responsable.updatedAt | date: 'dd/MM/yyyy HH:mm' }}</div>
                </div>
              </div>

              <div class="flex flex-wrap gap-2">
                <button class="btn btn-outline" type="button" (click)="ouvrirEdition(responsable)">Modifier</button>
                @if (responsable.isActive) {
                  <button class="btn btn-error btn-outline" type="button" [disabled]="facade.submitting()" (click)="desactiver(responsable)">
                    Desactiver
                  </button>
                } @else {
                  <button class="btn btn-success btn-outline" type="button" [disabled]="facade.submitting()" (click)="reactiver(responsable)">
                    Reactiver
                  </button>
                }
              </div>
            } @else {
              <div class="rounded-2xl border border-dashed border-base-300 p-6 text-sm text-base-content/60">
                Selectionnez un compte dans la liste pour afficher sa fiche et acceder aux actions rapides.
              </div>
            }
          </div>
        </article>
      </section>

      <section class="grid gap-4 md:grid-cols-4">
        <article class="stats border border-base-300 bg-base-100 shadow-sm">
          <div class="stat">
            <div class="stat-title">Total</div>
            <div class="stat-value text-primary">{{ facade.count() }}</div>
            <div class="stat-desc">Comptes responsables</div>
          </div>
        </article>
        <article class="stats border border-base-300 bg-base-100 shadow-sm">
          <div class="stat">
            <div class="stat-title">Actifs</div>
            <div class="stat-value text-success">{{ actifsCount() }}</div>
            <div class="stat-desc">Comptes operationnels</div>
          </div>
        </article>
        <article class="stats border border-base-300 bg-base-100 shadow-sm">
          <div class="stat">
            <div class="stat-title">Inactifs</div>
            <div class="stat-value text-warning">{{ inactifsCount() }}</div>
            <div class="stat-desc">Comptes desactives</div>
          </div>
        </article>
        <article class="stats border border-base-300 bg-base-100 shadow-sm">
          <div class="stat">
            <div class="stat-title">Centres couverts</div>
            <div class="stat-value text-secondary">{{ centresCount() }}</div>
            <div class="stat-desc">Centres avec responsable</div>
          </div>
        </article>
      </section>

      <section class="card border border-base-300 bg-base-100 shadow-sm">
        <div class="card-body gap-5">
          <div class="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.24em] text-base-content/45">Lecture / mise a jour</p>
              <h2 class="mt-2 text-2xl font-semibold text-base-content">Liste des responsables</h2>
            </div>

            <div class="grid gap-3 md:grid-cols-3">
              <div class="form-control gap-2">
                <label for="responsables-search" class="label-text text-base-content/65">Recherche email</label>
                <input
                  id="responsables-search"
                  type="text"
                  class="input input-bordered"
                  [ngModel]="searchTerm()"
                  (ngModelChange)="searchTerm.set($event)"
                  placeholder="Rechercher un email" />
              </div>

              <div class="form-control gap-2">
                <label for="responsables-centre-filter" class="label-text text-base-content/65">Filtre centre</label>
                <select
                  id="responsables-centre-filter"
                  class="select select-bordered"
                  [ngModel]="centreFilter()"
                  (ngModelChange)="centreFilter.set($event)">
                  <option value="all">Tous les centres</option>
                  @for (centre of centres(); track centre.id) {
                    <option [value]="centre.id">{{ centre.nom }} - {{ centre.ville }}</option>
                  }
                </select>
              </div>

              <div class="form-control gap-2">
                <label for="responsables-status-filter" class="label-text text-base-content/65">Statut</label>
                <select
                  id="responsables-status-filter"
                  class="select select-bordered"
                  [ngModel]="statusFilter()"
                  (ngModelChange)="statusFilter.set($event)">
                  <option value="all">Tous</option>
                  <option value="active">Actifs</option>
                  <option value="inactive">Inactifs</option>
                </select>
              </div>
            </div>
          </div>

          @if (facade.loading()) {
            <div class="flex items-center justify-center py-16">
              <span class="loading loading-spinner loading-lg text-primary"></span>
            </div>
          } @else {
            <div class="overflow-x-auto">
              <table class="table table-zebra">
                <thead>
                  <tr>
                    <th>Responsable</th>
                    <th>Centre</th>
                    <th>Statut</th>
                    <th>Maj</th>
                    <th class="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (responsable of filteredResponsables(); track responsable.id) {
                    <tr
                      class="cursor-pointer"
                      [class.bg-base-200]="currentSelectedId() === responsable.id"
                      (click)="selectionner(responsable.id)">
                      <td>
                        <div class="font-medium text-base-content">{{ responsable.email }}</div>
                        <div class="text-xs text-base-content/50">{{ responsable.id }}</div>
                      </td>
                      <td>{{ nomCentre(responsable.centreId) }}</td>
                      <td>
                        <span class="badge" [class.badge-success]="responsable.isActive" [class.badge-ghost]="!responsable.isActive">
                          {{ responsable.isActive ? 'ACTIF' : 'INACTIF' }}
                        </span>
                      </td>
                      <td>{{ responsable.updatedAt | date: 'dd/MM/yyyy HH:mm' }}</td>
                      <td>
                        <div class="flex justify-end gap-2">
                          <button class="btn btn-sm btn-outline" type="button" (click)="ouvrirEditionDepuisListe($event, responsable)">
                            Modifier
                          </button>
                          @if (responsable.isActive) {
                            <button
                              class="btn btn-sm btn-error btn-outline"
                              type="button"
                              [disabled]="facade.submitting()"
                              (click)="desactiverDepuisListe($event, responsable)">
                              Desactiver
                            </button>
                          } @else {
                            <button
                              class="btn btn-sm btn-success btn-outline"
                              type="button"
                              [disabled]="facade.submitting()"
                              (click)="reactiverDepuisListe($event, responsable)">
                              Reactiver
                            </button>
                          }
                        </div>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="5" class="py-16 text-center text-base-content/55">
                        Aucun responsable ne correspond aux filtres courants.
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      </section>

      @if (editVisible()) {
        <div class="modal modal-open">
          <div class="modal-box max-w-2xl">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-2xl font-semibold">Modifier le responsable</h3>
                <p class="mt-2 text-sm text-base-content/60">
                  Ajustez l'email, le mot de passe, le rattachement centre ou le statut du compte.
                </p>
              </div>
              <button class="btn btn-sm btn-circle btn-ghost" type="button" (click)="fermerEdition()">✕</button>
            </div>

            @if (selectedResponsable(); as responsable) {
              <form class="mt-6 space-y-4" (ngSubmit)="sauvegarderEdition()">
                <div class="form-control gap-2">
                  <label for="edit-responsable-email" class="label-text font-medium text-base-content/70">Email</label>
                  <input
                    id="edit-responsable-email"
                    type="email"
                    class="input input-bordered"
                    name="editEmail"
                    [(ngModel)]="editForm.email"
                    placeholder="responsable@centre.fr" />
                </div>

                <div class="form-control gap-2">
                  <label for="edit-responsable-password" class="label-text font-medium text-base-content/70">Nouveau mot de passe</label>
                  <input
                    id="edit-responsable-password"
                    type="password"
                    class="input input-bordered"
                    name="editPassword"
                    [(ngModel)]="editForm.password"
                    placeholder="Laisser vide pour ne pas modifier" />
                </div>

                <div class="form-control gap-2">
                  <label for="edit-responsable-centre" class="label-text font-medium text-base-content/70">Centre</label>
                  <select
                    id="edit-responsable-centre"
                    class="select select-bordered"
                    name="editCentreId"
                    [(ngModel)]="editForm.centreId">
                    @for (centre of centres(); track centre.id) {
                      <option [value]="centre.id">{{ centre.nom }} - {{ centre.ville }}</option>
                    }
                  </select>
                </div>

                <label for="edit-responsable-active" class="label cursor-pointer justify-start gap-3 rounded-2xl border border-base-300 px-4 py-3">
                  <input
                    id="edit-responsable-active"
                    type="checkbox"
                    class="toggle toggle-primary"
                    name="editIsActive"
                    [(ngModel)]="editForm.isActive" />
                  <span class="label-text">Compte actif</span>
                </label>

                <div class="rounded-2xl border border-base-300 bg-base-200/40 p-4 text-sm text-base-content/65">
                  Responsable selectionne: <span class="font-medium text-base-content">{{ responsable.email }}</span>
                </div>

                <div class="modal-action">
                  <button class="btn btn-ghost" type="button" (click)="fermerEdition()">Annuler</button>
                  <button class="btn btn-primary" type="submit" [disabled]="facade.submitting()">
                    @if (facade.submitting()) {
                      <span class="loading loading-spinner loading-sm"></span>
                    }
                    <span>Enregistrer</span>
                  </button>
                </div>
              </form>
            }
          </div>
          <button class="modal-backdrop" type="button" (click)="fermerEdition()">Fermer</button>
        </div>
      }
    </section>
  `,
})
export class ResponsableListComponent implements OnInit {
  readonly facade = inject(ResponsableCentreFacade);
  private readonly centreFacade = inject(CentreFacade);

  readonly centres = this.centreFacade.centres;
  readonly responsables = this.facade.responsables;

  readonly searchTerm = signal('');
  readonly centreFilter = signal('all');
  readonly statusFilter = signal<'all' | 'active' | 'inactive'>('all');
  readonly selectedResponsableId = signal<string | null>(null);
  readonly editVisible = signal(false);

  readonly selectedResponsable = computed(() => {
    const responsables = this.filteredResponsables();
    const selectedId = this.selectedResponsableId();

    return responsables.find(item => item.id === selectedId) ?? responsables[0] ?? null;
  });
  readonly currentSelectedId = computed(() => this.selectedResponsable()?.id ?? null);

  readonly filteredResponsables = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    const centreId = this.centreFilter();
    const status = this.statusFilter();

    return [...this.responsables()]
      .sort((a, b) => Number(b.isActive) - Number(a.isActive) || a.email.localeCompare(b.email))
      .filter(responsable => {
        if (centreId !== 'all' && responsable.centreId !== centreId) {
          return false;
        }
        if (status === 'active' && !responsable.isActive) {
          return false;
        }
        if (status === 'inactive' && responsable.isActive) {
          return false;
        }
        if (query && !responsable.email.toLowerCase().includes(query)) {
          return false;
        }
        return true;
      });
  });

  readonly actifsCount = computed(() => this.responsables().filter(item => item.isActive).length);
  readonly inactifsCount = computed(() => this.responsables().filter(item => !item.isActive).length);
  readonly centresCount = computed(() => new Set(this.responsables().map(item => item.centreId)).size);

  readonly createForm: CreerResponsableCentreDto = {
    email: '',
    password: '',
    centreId: '',
  };

  editForm: ModifierResponsableCentreDto = {};

  async ngOnInit(): Promise<void> {
    await Promise.all([this.centreFacade.charger(), this.facade.charger()]);
    const first = this.filteredResponsables()[0];
    if (first) {
      this.selectedResponsableId.set(first.id);
    }
  }

  canCreate(): boolean {
    return Boolean(
      this.createForm.email.trim() &&
      this.createForm.password.trim() &&
      this.createForm.centreId.trim()
    );
  }

  selectionner(id: string): void {
    this.selectedResponsableId.set(id);
  }

  async creer(): Promise<void> {
    if (!this.canCreate()) {
      return;
    }

    const created = await this.facade.creer({
      email: this.createForm.email.trim(),
      password: this.createForm.password.trim(),
      centreId: this.createForm.centreId,
    });

    if (!created) {
      return;
    }

    this.selectedResponsableId.set(created.id);
    this.createForm.email = '';
    this.createForm.password = '';
    this.createForm.centreId = '';
  }

  ouvrirEdition(responsable: ResponsableCentreDto): void {
    this.selectedResponsableId.set(responsable.id);
    this.editForm = {
      email: responsable.email,
      centreId: responsable.centreId,
      isActive: responsable.isActive,
    };
    this.editVisible.set(true);
  }

  ouvrirEditionDepuisListe(event: Event, responsable: ResponsableCentreDto): void {
    event.stopPropagation();
    this.ouvrirEdition(responsable);
  }

  fermerEdition(): void {
    this.editVisible.set(false);
    this.editForm = {};
  }

  async sauvegarderEdition(): Promise<void> {
    const selected = this.selectedResponsable();
    if (!selected) {
      return;
    }

    const payload: ModifierResponsableCentreDto = {
      email: this.editForm.email?.trim() || undefined,
      centreId: this.editForm.centreId || undefined,
      isActive: this.editForm.isActive,
    };

    if (this.editForm.password?.trim()) {
      payload.password = this.editForm.password.trim();
    }

    const updated = await this.facade.modifier(selected.id, payload);
    if (!updated) {
      return;
    }

    this.selectedResponsableId.set(updated.id);
    this.fermerEdition();
  }

  async desactiver(responsable: ResponsableCentreDto): Promise<void> {
    if (!responsable.isActive) {
      return;
    }

    if (!window.confirm(`Desactiver le compte ${responsable.email} ?`)) {
      return;
    }

    const success = await this.facade.supprimer(responsable.id);
    if (success) {
      this.selectedResponsableId.set(responsable.id);
    }
  }

  async desactiverDepuisListe(event: Event, responsable: ResponsableCentreDto): Promise<void> {
    event.stopPropagation();
    await this.desactiver(responsable);
  }

  async reactiver(responsable: ResponsableCentreDto): Promise<void> {
    const updated = await this.facade.reactiver(responsable.id);
    if (updated) {
      this.selectedResponsableId.set(updated.id);
    }
  }

  async reactiverDepuisListe(event: Event, responsable: ResponsableCentreDto): Promise<void> {
    event.stopPropagation();
    await this.reactiver(responsable);
  }

  nomCentre(centreId: string): string {
    const centre = this.centres().find(item => item.id === centreId);
    return centre ? `${centre.nom} - ${centre.ville}` : centreId;
  }
}
