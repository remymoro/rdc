import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CentreFacade } from '../../../application/facades/centre.facade';
import { CentreFormComponent } from '../centre-form/centre-form.component';

@Component({
  selector: 'app-centre-list',
  standalone: true,
  imports: [CommonModule, CentreFormComponent],
  template: `
    <div class="container">
      <h1>Centres</h1>
      <p>Total : {{ facade.count() }} centre(s)</p>

      @if (facade.error()) {
        <div class="error">{{ facade.error() }}</div>
      }

      @if (facade.loading()) {
        <p>Chargement...</p>
      }

      <app-centre-form (centreCreer)="onCentreCreer($event)" />

      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Ville</th>
            <th>Code postal</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (centre of facade.centres(); track centre.id) {
            <tr>
              <td>{{ centre.nom }}</td>
              <td>{{ centre.ville }}</td>
              <td>{{ centre.codePostal }}</td>
              <td>{{ centre.statut }}</td>
              <td>
                @if (centre.statut === 'ACTIF') {
                  <button (click)="desactiver(centre.id)">Désactiver</button>
                }
                @if (centre.statut !== 'ARCHIVE') {
                  <button (click)="archiver(centre.id)">Archiver</button>
                }
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class CentreListComponent implements OnInit {
  readonly facade = inject(CentreFacade);

  ngOnInit(): void {
    this.facade.charger();
  }

  onCentreCreer(dto: any): void {
    this.facade.creer(dto);
  }

  desactiver(id: string): void {
    this.facade.desactiver(id);
  }

  archiver(id: string): void {
    this.facade.archiver(id);
  }
}
