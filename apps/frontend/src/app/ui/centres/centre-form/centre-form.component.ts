import { Component, Output, EventEmitter, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreerCentreDto } from '@rdc/shared';

@Component({
  selector: 'app-centre-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()">
      <h2>Nouveau centre</h2>

      <input [(ngModel)]="form.nom" name="nom" placeholder="Nom *" required />
      <input [(ngModel)]="form.ville" name="ville" placeholder="Ville *" required />
      <input [(ngModel)]="form.codePostal" name="codePostal" placeholder="Code postal *" required />
      <input [(ngModel)]="form.adresse" name="adresse" placeholder="Adresse *" required />
      <input [(ngModel)]="form.telephone" name="telephone" placeholder="Téléphone" />
      <input [(ngModel)]="form.email" name="email" placeholder="Email" />

      <button type="submit">Créer</button>
    </form>
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
