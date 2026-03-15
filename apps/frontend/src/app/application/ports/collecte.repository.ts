import { Observable } from 'rxjs';
import { CollecteDto, CollecteParticipationCentreDto } from '@rdc/shared';

export interface CreerCollecteDto {
  nom: string;
  dateDebut: string;
  dateFin: string;
  dateFinSaisie: string;
}

export abstract class CollecteRepository {
  abstract findAll(): Observable<CollecteDto[]>;
  abstract creer(dto: CreerCollecteDto): Observable<CollecteDto>;
  abstract ouvrirInscriptions(id: string): Observable<void>;
  abstract ajouterMagasin(collecteId: string, magasinId: string): Observable<void>;
  abstract retirerMagasin(collecteId: string, magasinId: string): Observable<void>;
  abstract mesParticipations(): Observable<CollecteParticipationCentreDto[]>;
}
