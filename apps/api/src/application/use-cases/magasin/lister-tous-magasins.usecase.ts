import { Inject, Injectable } from '@nestjs/common';
import { IMagasinRepository, Magasin } from '@rdc/domain';

@Injectable()
export class ListerTousMagasinsUseCase {
  constructor(
    @Inject('IMagasinRepository') private readonly magasins: IMagasinRepository,
  ) {}

  async execute(): Promise<Magasin[]> {
    return this.magasins.findAll();
  }
}
