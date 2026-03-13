import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
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
  imports: [FormsModule, ButtonModule, DialogModule, InputTextModule, PasswordModule, SelectModule, TagModule],
  template: `
    <section class="space-y-5">
      <header class="flex items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-slate-800">Responsables centre</h1>
          <p class="text-sm text-slate-500">Gestion des comptes rattachés aux centres</p>
        </div>
        <span class="text-sm text-slate-500">{{ facade.count() }} compte(s)</span>
      </header>

      @if (facade.error()) {
        <div class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {{ facade.error() }}
        </div>
      }

      <section class="rounded-2xl border border-slate-200 bg-white/85 backdrop-blur p-5 shadow-sm">
        <h2 class="text-base font-medium text-slate-700 mb-4">Créer un responsable</h2>
        <form class="grid grid-cols-1 md:grid-cols-4 gap-3" (ngSubmit)="creer()">
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-slate-700">Email</label>
            <input
              pInputText
              type="email"
              name="email"
              [(ngModel)]="createForm.email"
              placeholder="Email"
              required />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-slate-700">Mot de passe</label>
            <p-password
              inputId="new-responsable-password"
              [feedback]="false"
              [toggleMask]="true"
              name="password"
              [(ngModel)]="createForm.password"
              placeholder="Mot de passe"
              required />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-slate-700">Centre</label>
            <p-select
              name="centreId"
              [(ngModel)]="createForm.centreId"
              [options]="centresOptions()"
              optionLabel="label"
              optionValue="id"
              placeholder="Choisir un centre..."
              required />
          </div>
          <div class="flex items-end">
            <p-button type="submit" label="Créer" icon="pi pi-plus" [loading]="facade.loading()" styleClass="w-full" />
          </div>
        </form>
      </section>

      <section class="rounded-2xl border border-slate-200 bg-white/85 backdrop-blur shadow-sm overflow-hidden">
        @if (facade.loading()) {
          <div class="p-8 text-center text-slate-400">Chargement...</div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-slate-50 text-slate-600 uppercase text-xs tracking-wide">
                <tr>
                  <th class="px-4 py-3 text-left">Email</th>
                  <th class="px-4 py-3 text-left">Centre</th>
                  <th class="px-4 py-3 text-left">Statut</th>
                  <th class="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (responsable of facade.responsables(); track responsable.id) {
                  <tr class="hover:bg-slate-50 transition-colors">
                    <td class="px-4 py-3 text-slate-800 font-medium">{{ responsable.email }}</td>
                    <td class="px-4 py-3 text-slate-600">{{ nomCentre(responsable.centreId) }}</td>
                    <td class="px-4 py-3">
                      <p-tag [value]="responsable.isActive ? 'ACTIF' : 'INACTIF'" [severity]="responsable.isActive ? 'success' : 'secondary'" />
                    </td>
                    <td class="px-4 py-3">
                      <div class="flex flex-wrap gap-2">
                        <p-button
                          label="Modifier"
                          icon="pi pi-pencil"
                          size="small"
                          severity="secondary"
                          (onClick)="ouvrirEdition(responsable)" />
                        <p-button
                          label="Désactiver"
                          icon="pi pi-times"
                          size="small"
                          severity="danger"
                          [outlined]="true"
                          [disabled]="!responsable.isActive"
                          (onClick)="supprimer(responsable.id)" />
                      </div>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="4" class="px-4 py-12 text-center text-slate-400">
                      <i class="pi pi-users block mb-2" style="font-size: 2rem"></i>
                      Aucun responsable enregistré
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>

      <p-dialog
        header="Modifier le responsable"
        [modal]="true"
        [visible]="editVisible()"
        [style]="{ width: '34rem' }"
        (visibleChange)="editVisible.set($event)">
        @if (selectedResponsable()) {
          <form class="space-y-4" (ngSubmit)="sauvegarderEdition()">
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium text-slate-700">Email</label>
              <input pInputText type="email" name="editEmail" [(ngModel)]="editForm.email" placeholder="Email" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium text-slate-700">Nouveau mot de passe</label>
              <p-password
                inputId="edit-password"
                [feedback]="false"
                [toggleMask]="true"
                name="editPassword"
                [(ngModel)]="editForm.password"
                placeholder="Laisser vide pour ne pas changer" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium text-slate-700">Centre</label>
              <p-select
                name="editCentreId"
                [(ngModel)]="editForm.centreId"
                [options]="centresOptions()"
                optionLabel="label"
                optionValue="id"
                placeholder="Choisir un centre..." />
            </div>
            <label class="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" name="editIsActive" [(ngModel)]="editForm.isActive" class="rounded" />
              Compte actif
            </label>
            <div class="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <p-button type="button" label="Annuler" severity="secondary" (onClick)="editVisible.set(false)" />
              <p-button type="submit" label="Enregistrer" icon="pi pi-check" />
            </div>
          </form>
        }
      </p-dialog>
    </section>
  `,
})
export class ResponsableListComponent implements OnInit {
  readonly facade = inject(ResponsableCentreFacade);
  private readonly centreFacade = inject(CentreFacade);

  readonly centres = this.centreFacade.centres;
  readonly centresOptions = computed(() =>
    this.centres().map(c => ({ id: c.id, label: `${c.nom} — ${c.ville}` }))
  );

  readonly editVisible = signal(false);
  readonly selectedResponsable = signal<ResponsableCentreDto | null>(null);

  readonly createForm: CreerResponsableCentreDto = {
    email: '',
    password: '',
    centreId: '',
  };

  editForm: ModifierResponsableCentreDto = {};

  ngOnInit(): void {
    this.centreFacade.charger();
    this.facade.charger();
  }

  creer(): void {
    this.facade.creer({ ...this.createForm });
    this.createForm.email = '';
    this.createForm.password = '';
    this.createForm.centreId = '';
  }

  ouvrirEdition(responsable: ResponsableCentreDto): void {
    this.selectedResponsable.set(responsable);
    this.editForm = {
      email: responsable.email,
      centreId: responsable.centreId,
      isActive: responsable.isActive,
    };
    this.editVisible.set(true);
  }

  sauvegarderEdition(): void {
    const selected = this.selectedResponsable();
    if (!selected) return;

    const payload = { ...this.editForm };
    if (!payload.password) {
      delete payload.password;
    }

    this.facade.modifier(selected.id, payload);
    this.editVisible.set(false);
  }

  supprimer(id: string): void {
    this.facade.supprimer(id);
  }

  nomCentre(centreId: string): string {
    const centre = this.centres().find(item => item.id === centreId);
    return centre ? `${centre.nom} — ${centre.ville}` : centreId;
  }
}
