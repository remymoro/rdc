import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreerResponsableCentreDto,
  ModifierResponsableCentreDto,
  ResponsableCentreDto,
} from '@rdc/shared';
import {
  ResponsableCentreFilters,
  ResponsableCentreRepository,
} from '../../application/ports/responsable-centre.repository';

@Injectable()
export class ResponsableCentreHttpRepository extends ResponsableCentreRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/admin/responsables';

  findAll(filters?: ResponsableCentreFilters): Observable<ResponsableCentreDto[]> {
    let params = new HttpParams();

    if (filters?.centreId) {
      params = params.set('centreId', filters.centreId);
    }
    if (filters?.isActive !== undefined) {
      params = params.set('isActive', String(filters.isActive));
    }

    return this.http.get<ResponsableCentreDto[]>(this.apiUrl, { params });
  }

  create(dto: CreerResponsableCentreDto): Observable<ResponsableCentreDto> {
    return this.http.post<ResponsableCentreDto>(this.apiUrl, dto);
  }

  update(id: string, dto: ModifierResponsableCentreDto): Observable<ResponsableCentreDto> {
    return this.http.patch<ResponsableCentreDto>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
