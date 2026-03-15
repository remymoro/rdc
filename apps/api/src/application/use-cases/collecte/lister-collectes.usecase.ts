import { Inject, Injectable } from '@nestjs/common';
import { Collecte, ICollecteRepository } from '@rdc/domain';

@Injectable()
export class ListerCollectesUseCase {
  constructor(
    @Inject('ICollecteRepository') private readonly collectes: ICollecteRepository,
  ) {}

  async execute(): Promise<Collecte[]> {
    return this.collectes.findAll();
  }
}
