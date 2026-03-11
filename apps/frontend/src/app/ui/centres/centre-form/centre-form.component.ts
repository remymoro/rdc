import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { CreerCentreDto } from '@rdc/shared';

@Component({
  selector: 'app-centre-form',
  standalone: true,
  imports: [FormsModule, InputTextModule, ButtonModule, PanelModule],
  template: `
    <p-panel header="Nouveau centre" [toggleable]="true" [collapsed]="true">
      <form (ngSubmit)="onSubmit()" class="grid grid-cols-2 gap-4 pt-2">
        <div class="flex flex-col gap-1">
          <label for="nom" class="text-sm font-medium text-gray-700">Nom *</label>
          <input id="nom" pInputText [(ngModel)]="form.nom" name="nom" placeholder="Centre Paris" required />
        </div>
        <div class="flex flex-col gap-1">
          <label for="ville" class="text-sm font-medium text-gray-700">Ville *</label>
          <input id="ville" pInputText [(ngModel)]="form.ville" name="ville" placeholder="Paris" required />
        </div>
        <div class="flex flex-col gap-1">
          <label for="codePostal" class="text-sm font-medium text-gray-700">Code postal *</label>
          <input id="codePostal" pInputText [(ngModel)]="form.codePostal" name="codePostal" placeholder="75001" required />
        </div>
        <div class="flex flex-col gap-1">
          <label for="adresse" class="text-sm font-medium text-gray-700">Adresse *</label>
          <input id="adresse" pInputText [(ngModel)]="form.adresse" name="adresse" placeholder="1 rue de la Paix" required />
        </div>
        <div class="flex flex-col gap-1">
          <label for="telephone" class="text-sm font-medium text-gray-700">Téléphone</label>
          <input id="telephone" pInputText [(ngModel)]="form.telephone" name="telephone" placeholder="06 12 34 56 78" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="email" class="text-sm font-medium text-gray-700">Email</label>
          <input id="email" pInputText [(ngModel)]="form.email" name="email" placeholder="contact@centre.fr" />
        </div>
        <div class="col-span-2 flex justify-end pt-2">
          <p-button type="submit" label="Créer le centre" icon="pi pi-plus" />
        </div>
      </form>
    </p-panel>
  `,
})
export class CentreFormComponent {
  @Output() centreCreer = new EventEmitter<CreerCentreDto>();

  form: CreerCentreDto = {
    nom: '',
    ville: '',
    codePostal: '',
    adresse: '',
    telephone: '',
    email: '',
  };

  onSubmit(): void {
    this.centreCreer.emit({ ...this.form });
    this.form = { nom: '', ville: '', codePostal: '', adresse: '', telephone: '', email: '' };
  }
}
