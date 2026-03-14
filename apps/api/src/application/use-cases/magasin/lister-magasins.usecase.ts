import { Inject, Injectable } from '@nestjs/common';
import { CentreId, IMagasinRepository, Magasin } from '@rdc/domain';

@Injectable()
export class ListerMagasinsUseCase {
  constructor(
    @Inject('IMagasinRepository') private readonly magasins: IMagasinRepository,
  ) {}

  async execute(centreId: string): Promise<Magasin[]> {
    return this.magasins.findByCentreId(CentreId.create(centreId));
  }
}
