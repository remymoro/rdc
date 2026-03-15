import { Inject, Injectable } from '@nestjs/common';
import { CollecteId, DomainNotFoundException, ICollecteRepository } from '@rdc/domain';

@Injectable()
export class OuvrirInscriptionsUseCase {
  constructor(
    @Inject('ICollecteRepository') private readonly collectes: ICollecteRepository,
  ) {}

  async execute(collecteId: string): Promise<void> {
    const id = CollecteId.create(collecteId);
    const collecte = await this.collectes.findById(id);

    if (!collecte) {
      throw new DomainNotFoundException(`Collecte ${collecteId} introuvable`, 'COLLECTE_NOT_FOUND');
    }

    // La règle métier est dans l'agrégat
    collecte.ouvrirInscriptions();

    await this.collectes.save(collecte);
  }
}
