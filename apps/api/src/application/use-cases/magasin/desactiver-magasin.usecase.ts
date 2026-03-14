import { Inject, Injectable } from '@nestjs/common';
import { DomainNotFoundException, IMagasinRepository, MagasinId } from '@rdc/domain';

@Injectable()
export class DesactiverMagasinUseCase {
  constructor(
    @Inject('IMagasinRepository') private readonly magasins: IMagasinRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const magasin = await this.magasins.findById(MagasinId.create(id));

    if (!magasin) {
      throw new DomainNotFoundException(`Magasin ${id} introuvable`, 'MAGASIN_NOT_FOUND');
    }

    magasin.desactiver();
    await this.magasins.save(magasin);
  }
}
