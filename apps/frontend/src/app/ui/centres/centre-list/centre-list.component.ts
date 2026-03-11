import { Component, OnInit, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CreerCentreDto } from '@rdc/shared';
import { CentreFacade } from '../../../application/facades/centre.facade';
import { CentreFormComponent } from '../centre-form/centre-form.component';

@Component({
  selector: 'app-centre-list',
  standalone: true,
  imports: [ButtonModule, TagModule, CentreFormComponent],
  template: `
    <div class="p-6 max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Centres</h1>
        <span class="text-sm text-gray-500">{{ facade.count() }} centre(s)</span>
      </div>

      @if (facade.error()) {
        <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {{ facade.error() }}
        </div>
      }

      <div class="mb-6">
        <app-centre-form (centreCreer)="onCentreCreer($event)" />
      </div>

      @if (facade.loading()) {
        <div class="flex justify-center py-10 text-gray-400">Chargement...</div>
      } @else {
        <div class="rounded-lg border border-gray-200 overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
              <tr>
                <th class="px-4 py-3 text-left">Nom</th>
                <th class="px-4 py-3 text-left">Ville</th>
                <th class="px-4 py-3 text-left">Code postal</th>
                <th class="px-4 py-3 text-left">Statut</th>
                <th class="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              @for (centre of facade.centres(); track centre.id) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-4 py-3 font-medium text-gray-800">{{ centre.nom }}</td>
                  <td class="px-4 py-3 text-gray-600">{{ centre.ville }}</td>
                  <td class="px-4 py-3 text-gray-600">{{ centre.codePostal }}</td>
                  <td class="px-4 py-3">
                    <p-tag [value]="centre.statut" [severity]="statutSeverity(centre.statut)" />
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex gap-2">
                      @if (centre.statut === 'ACTIF') {
                        <p-button
                          label="Désactiver"
                          severity="warn"
                          size="small"
                          (onClick)="desactiver(centre.id)" />
                      }
                      @if (centre.statut !== 'ARCHIVE') {
                        <p-button
                          label="Archiver"
                          severity="danger"
                          size="small"
                          (onClick)="archiver(centre.id)" />
                      }
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="px-4 py-10 text-center text-gray-400">
                    Aucun centre enregistré
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
})
export class CentreListComponent implements OnInit {
  readonly facade = inject(CentreFacade);

  ngOnInit(): void {
    this.facade.charger();
  }

  onCentreCreer(dto: CreerCentreDto): void {
    this.facade.creer(dto);
  }

  desactiver(id: string): void {
    this.facade.desactiver(id);
  }

  archiver(id: string): void {
    this.facade.archiver(id);
  }

  statutSeverity(statut: string): 'success' | 'warn' | 'secondary' {
    const map: Record<string, 'success' | 'warn' | 'secondary'> = {
      ACTIF: 'success',
      INACTIF: 'warn',
      ARCHIVE: 'secondary',
    };
    return map[statut] ?? 'secondary';
  }
}
