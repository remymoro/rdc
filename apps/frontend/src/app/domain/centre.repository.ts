import { Observable } from 'rxjs';
import { CentreDto, CreerCentreDto } from '@rdc/shared';

export abstract class CentreRepository {
  abstract findAll(): Observable<CentreDto[]>;
  abstract creer(dto: CreerCentreDto): Observable<CentreDto>;
  abstract desactiver(id: string): Observable<void>;
  abstract archiver(id: string): Observable<void>;
}
