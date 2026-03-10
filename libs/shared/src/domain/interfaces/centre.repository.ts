import { Centre } from '../entities/centre.entity';
import { CentreId } from '../value-objects/centre-id.vo';

export interface ICentreRepository {
  findById(id: CentreId): Promise<Centre | null>;
  findByUniqueKey(params: {
    nom: string;
    ville: string;
    codePostal: string;
    adresse: string;
  }): Promise<Centre | null>;
  findAll(): Promise<Centre[]>;
  save(centre: Centre): Promise<void>;
  delete(id: CentreId): Promise<void>;
}
