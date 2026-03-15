import { Inject, Injectable } from '@nestjs/common';
import {
  CollecteId,
  DomainNotFoundException,
  ICollecteRepository,
  IMagasinRepository,
  MagasinId,
} from '@rdc/domain';

@Injectable()
export class AjouterMagasinCollecteUseCase {
  constructor(
    @Inject('ICollecteRepository') private readonly collectes: ICollecteRepository,
    @Inject('IMagasinRepository') private readonly magasins: IMagasinRepository,
  ) {}

  async execute(params: { collecteId: string; magasinId: string }): Promise<void> {
    const collecteId = CollecteId.create(params.collecteId);
    const magasinId = MagasinId.create(params.magasinId);

    // On vérifie que les deux existent
    const collecte = await this.collectes.findById(collecteId);
    if (!collecte) {
      throw new DomainNotFoundException(`Collecte ${params.collecteId} introuvable`, 'COLLECTE_NOT_FOUND');
    }

    const magasin = await this.magasins.findById(magasinId);
    if (!magasin) {
      throw new DomainNotFoundException(`Magasin ${params.magasinId} introuvable`, 'MAGASIN_NOT_FOUND');
    }

    // La règle "seulement en PREPARATION" est dans l'agrégat
    collecte.ajouterMagasin(magasinId);

    await this.collectes.save(collecte);
  }
}
