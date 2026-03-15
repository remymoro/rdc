import { Collecte } from './collecte.entity';
import { CollecteId } from '../value-objects/collecte-id.vo';

export interface ICollecteRepository {
  findById(id: CollecteId): Promise<Collecte | null>;
  findAll(): Promise<Collecte[]>;
  save(collecte: Collecte): Promise<void>;
  delete(id: CollecteId): Promise<void>;
}
