import { Inject, Injectable } from '@nestjs/common';
import { DomainNotFoundException, IMagasinRepository, Magasin, MagasinId } from '@rdc/domain';

@Injectable()
export class ObtenirMagasinUseCase {
  constructor(
    @Inject('IMagasinRepository') private readonly magasins: IMagasinRepository,
  ) {}

  async execute(id: string): Promise<Magasin> {
    const magasin = await this.magasins.findById(MagasinId.create(id));

    if (!magasin) {
      throw new DomainNotFoundException(`Magasin ${id} introuvable`, 'MAGASIN_NOT_FOUND');
    }

    return magasin;
  }
}
