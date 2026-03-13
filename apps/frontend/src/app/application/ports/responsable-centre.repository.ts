import { Observable } from 'rxjs';
import {
  CreerResponsableCentreDto,
  ModifierResponsableCentreDto,
  ResponsableCentreDto,
} from '@rdc/shared';

export interface ResponsableCentreFilters {
  centreId?: string;
  isActive?: boolean;
}

export abstract class ResponsableCentreRepository {
  abstract findAll(filters?: ResponsableCentreFilters): Observable<ResponsableCentreDto[]>;
  abstract create(dto: CreerResponsableCentreDto): Observable<ResponsableCentreDto>;
  abstract update(id: string, dto: ModifierResponsableCentreDto): Observable<ResponsableCentreDto>;
  abstract delete(id: string): Observable<void>;
}
