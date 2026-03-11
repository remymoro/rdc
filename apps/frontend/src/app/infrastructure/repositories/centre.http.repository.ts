import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CentreDto, CreerCentreDto, ModifierCentreDto } from '@rdc/shared';
import { CentreRepository } from '../../domain/centre.repository';

@Injectable()
export class CentreHttpRepository extends CentreRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/centres';

  findAll(): Observable<CentreDto[]> {
    return this.http.get<CentreDto[]>(this.apiUrl);
  }

  creer(dto: CreerCentreDto): Observable<CentreDto> {
    return this.http.post<CentreDto>(this.apiUrl, dto);
  }

  modifier(id: string, dto: ModifierCentreDto): Observable<CentreDto> {
    return this.http.patch<CentreDto>(`${this.apiUrl}/${id}`, dto);
  }

  desactiver(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/desactiver`, {});
  }

  archiver(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/archiver`, {});
  }
}
