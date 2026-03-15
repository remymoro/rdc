import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreerMagasinDto, MagasinDto, MagasinImageDto, ModifierMagasinDto } from '@rdc/shared';
import { MagasinFilters, MagasinRepository } from '../../application/ports/magasin.repository';

@Injectable()
export class MagasinHttpRepository extends MagasinRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api';

  findAll(filters?: MagasinFilters): Observable<MagasinDto[]> {
    if (filters?.centreId) {
      return this.findByCentreId(filters.centreId);
    }

    const centreIds = [...new Set(filters?.centreIds?.filter(Boolean) ?? [])];
    if (centreIds.length) {
      return forkJoin(centreIds.map(centreId => this.findByCentreId(centreId))).pipe(
        map(results =>
          results
            .flat()
            .sort((a, b) =>
              a.centreId.localeCompare(b.centreId) || a.nom.localeCompare(b.nom)
            )
        ),
      );
    }

    // Pas de filtre → tous les magasins (admin)
    return this.http.get<MagasinDto[]>(`${this.apiUrl}/magasins`);
  }

  creer(dto: CreerMagasinDto): Observable<MagasinDto> {
    const { centreId, ...payload } = dto;
    return this.http.post<MagasinDto>(`${this.apiUrl}/centres/${centreId}/magasins`, payload);
  }

  modifier(id: string, dto: ModifierMagasinDto): Observable<MagasinDto> {
    return this.http.patch<MagasinDto>(`${this.apiUrl}/magasins/${id}`, dto);
  }

  desactiver(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/magasins/${id}/desactiver`, {});
  }

  activer(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/magasins/${id}/activer`, {});
  }

  archiver(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/magasins/${id}/archiver`, {});
  }

  ajouterImage(magasinId: string, file: File): Observable<MagasinImageDto> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<MagasinImageDto>(`${this.apiUrl}/magasins/${magasinId}/images`, formData);
  }

  supprimerImage(magasinId: string, imageId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/magasins/${magasinId}/images/${imageId}`);
  }

  private findByCentreId(centreId: string): Observable<MagasinDto[]> {
    return this.http.get<MagasinDto[]>(`${this.apiUrl}/centres/${centreId}/magasins`);
  }
}
