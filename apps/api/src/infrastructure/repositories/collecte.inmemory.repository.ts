import { Injectable } from '@nestjs/common';
import { Collecte, CollecteId, ICollecteRepository } from '@rdc/domain';

/**
 * Implémentation en mémoire du port ICollecteRepository.
 *
 * Aucun code du domaine ou des use cases ne change.
 * On branche cet adaptateur à la place de Prisma dans le module.
 *
 * Utile pour :
 * - démarrer sans base de données
 * - tester les use cases sans infrastructure
 * - développer le frontend avant que la DB soit prête
 */
@Injectable()
export class CollecteInMemoryRepository implements ICollecteRepository {
  // Le "stockage" — un simple tableau en RAM
  private readonly store: Map<string, Collecte> = new Map();

  async findById(id: CollecteId): Promise<Collecte | null> {
    return this.store.get(id.value) ?? null;
  }

  async findAll(): Promise<Collecte[]> {
    return Array.from(this.store.values());
  }

  async save(collecte: Collecte): Promise<void> {
    this.store.set(collecte.id.value, collecte);
  }

  async delete(id: CollecteId): Promise<void> {
    this.store.delete(id.value);
  }
}
