import { Inject, Injectable } from '@nestjs/common';
import { Centre, ICentreRepository } from '@rdc/domain';

@Injectable()
export class ListerCentresUseCase {
  constructor(
    @Inject('ICentreRepository') private readonly centreRepository: ICentreRepository,
  ) {}

  async execute(): Promise<Centre[]> {
    return this.centreRepository.findAll();
  }
}
