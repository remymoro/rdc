import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CollecteDto } from '@rdc/shared';
import { CollecteRepository, CreerCollecteDto } from '../../application/ports/collecte.repository';

@Injectable()
export class CollecteHttpRepository extends CollecteRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/collectes';

  findAll(): Observable<CollecteDto[]> {
    return this.http.get<CollecteDto[]>(this.apiUrl);
  }

  creer(dto: CreerCollecteDto): Observable<CollecteDto> {
    return this.http.post<CollecteDto>(this.apiUrl, dto);
  }

  ouvrirInscriptions(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/ouvrir-inscriptions`, {});
  }

  ajouterMagasin(collecteId: string, magasinId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${collecteId}/magasins/${magasinId}`, {});
  }
}
