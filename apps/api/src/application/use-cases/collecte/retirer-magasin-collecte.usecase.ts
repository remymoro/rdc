import { Inject, Injectable } from '@nestjs/common';
import {
  CollecteId,
  DomainNotFoundException,
  ICollecteRepository,
  MagasinId,
} from '@rdc/domain';

@Injectable()
export class RetirerMagasinCollecteUseCase {
  constructor(
    @Inject('ICollecteRepository') private readonly collectes: ICollecteRepository,
  ) {}

  async execute(params: { collecteId: string; magasinId: string }): Promise<void> {
    const collecteId = CollecteId.create(params.collecteId);
    const magasinId = MagasinId.create(params.magasinId);

    const collecte = await this.collectes.findById(collecteId);
    if (!collecte) {
      throw new DomainNotFoundException(`Collecte ${params.collecteId} introuvable`, 'COLLECTE_NOT_FOUND');
    }

    // La règle "seulement en PREPARATION" est dans l'agrégat
    collecte.retirerMagasin(magasinId);

    await this.collectes.save(collecte);
  }
}
