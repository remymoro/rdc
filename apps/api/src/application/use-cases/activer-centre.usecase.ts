import { Inject, Injectable } from '@nestjs/common';
import { CentreId, DomainNotFoundException, ICentreRepository } from '@rdc/domain';

@Injectable()
export class ActiverCentreUseCase {
  constructor(
    @Inject('ICentreRepository') private readonly centreRepository: ICentreRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const centreId = CentreId.create(id);
    const centre = await this.centreRepository.findById(centreId);

    if (!centre) {
      throw new DomainNotFoundException(`Centre ${id} introuvable`, 'CENTRE_NOT_FOUND');
    }

    centre.activer();
    await this.centreRepository.save(centre);
  }
}
