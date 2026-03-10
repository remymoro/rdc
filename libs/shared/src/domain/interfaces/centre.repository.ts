import { Centre } from '../entities/centre.entity';
import { CentreId } from '../value-objects/centre-id.vo';

export interface ICentreRepository {
  findById(id: CentreId): Promise<Centre | null>;
  findAll(): Promise<Centre[]>;
  save(centre: Centre): Promise<void>;
  delete(id: CentreId): Promise<void>;
}
