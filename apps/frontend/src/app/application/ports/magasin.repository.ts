import { Observable } from 'rxjs';
import { CreerMagasinDto, MagasinDto, ModifierMagasinDto } from '@rdc/shared';

export interface MagasinFilters {
  centreId?: string;
}

export abstract class MagasinRepository {
  abstract findAll(filters?: MagasinFilters): Observable<MagasinDto[]>;
  abstract creer(dto: CreerMagasinDto): Observable<MagasinDto>;
  abstract modifier(id: string, dto: ModifierMagasinDto): Observable<MagasinDto>;
  abstract desactiver(id: string): Observable<void>;
  abstract activer(id: string): Observable<void>;
  abstract archiver(id: string): Observable<void>;
}
