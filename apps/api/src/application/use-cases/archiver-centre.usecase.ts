import { Inject, Injectable } from '@nestjs/common';
import { CentreId } from '@rdc/shared';
import type { ICentreRepository } from '@rdc/shared';

@Injectable()
export class ArchiverCentreUseCase {
  constructor(
    @Inject('ICentreRepository') private readonly centreRepository: ICentreRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const centreId = CentreId.create(id);
    const centre = await this.centreRepository.findById(centreId);

    if (!centre) {
      throw new Error(`Centre ${id} introuvable`);
    }

    centre.archiver();
    await this.centreRepository.save(centre);
  }
}
