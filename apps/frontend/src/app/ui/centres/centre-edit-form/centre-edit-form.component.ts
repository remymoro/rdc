import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CentreDto, ModifierCentreDto } from '@rdc/shared';

@Component({
  selector: 'app-centre-edit-form',
  standalone: true,
  imports: [FormsModule, InputTextModule, ButtonModule, DialogModule],
  template: `
    <p-dialog
      header="Modifier le centre"
      [visible]="visible"
      (visibleChange)="visibleChange.emit($event)"
      [modal]="true"
      [style]="{ width: '600px' }"
      [closable]="true">
      <form (ngSubmit)="onSubmit()" class="grid grid-cols-2 gap-4 pt-2">
        <div class="flex flex-col gap-1">
          <label for="edit-nom" class="text-sm font-medium text-gray-700">Nom</label>
          <input id="edit-nom" pInputText [(ngModel)]="form.nom" name="nom" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="edit-ville" class="text-sm font-medium text-gray-700">Ville</label>
          <input id="edit-ville" pInputText [(ngModel)]="form.ville" name="ville" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="edit-codePostal" class="text-sm font-medium text-gray-700">Code postal</label>
          <input id="edit-codePostal" pInputText [(ngModel)]="form.codePostal" name="codePostal" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="edit-adresse" class="text-sm font-medium text-gray-700">Adresse</label>
          <input id="edit-adresse" pInputText [(ngModel)]="form.adresse" name="adresse" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="edit-telephone" class="text-sm font-medium text-gray-700">Téléphone</label>
          <input id="edit-telephone" pInputText [(ngModel)]="form.telephone" name="telephone" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="edit-email" class="text-sm font-medium text-gray-700">Email</label>
          <input id="edit-email" pInputText [(ngModel)]="form.email" name="email" />
        </div>
        <div class="col-span-2 flex justify-end gap-2 pt-2">
          <p-button
            type="button"
            label="Annuler"
            severity="secondary"
            (onClick)="visibleChange.emit(false)" />
          <p-button
            type="submit"
            label="Enregistrer"
            icon="pi pi-check" />
        </div>
      </form>
    </p-dialog>
  `,
})
export class CentreEditFormComponent implements OnChanges {
  @Input() visible = false;
  @Input() centre: CentreDto | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() centreModifier = new EventEmitter<{ id: string; dto: ModifierCentreDto }>();

  form: ModifierCentreDto = {};

  ngOnChanges(): void {
    if (this.centre) {
      this.form = {
        nom: this.centre.nom,
        ville: this.centre.ville,
        codePostal: this.centre.codePostal,
        adresse: this.centre.adresse,
        telephone: this.centre.telephone ?? '',
        email: this.centre.email ?? '',
      };
    }
  }

  onSubmit(): void {
    if (!this.centre) return;
    this.centreModifier.emit({ id: this.centre.id, dto: { ...this.form } });
    this.visibleChange.emit(false);
  }
}
