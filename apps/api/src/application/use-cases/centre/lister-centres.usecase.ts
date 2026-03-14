import { Inject, Injectable } from '@nestjs/common';
import type { ICentreRepository } from '@rdc/domain';
import type { CentreDto } from '@rdc/shared';
import { mapCentreToDto } from './centre.mapper';

@Injectable()
export class ListerCentresUseCase {
  constructor(
    @Inject('ICentreRepository') private readonly centreRepository: ICentreRepository,
  ) {}

  async execute(): Promise<CentreDto[]> {
    const centres = await this.centreRepository.findAll();

    return centres.map(mapCentreToDto);
  }
}
