import { Inject, Injectable } from '@nestjs/common';
import { DomainNotFoundException, IUserRepository, UserRole } from '@rdc/domain';
import type { ResponsableCentreDto } from '@rdc/shared';
import { toResponsableDto } from './responsable-centre.mapper';

@Injectable()
export class ObtenirResponsableUseCase {
  constructor(@Inject('IUserRepository') private readonly users: IUserRepository) {}

  async execute(id: string): Promise<ResponsableCentreDto> {
    const user = await this.users.findById(id);

    if (!user || user.role !== UserRole.RESPONSABLE_CENTRE || !user.centreId) {
      throw new DomainNotFoundException('Responsable centre introuvable', 'RESPONSABLE_NOT_FOUND');
    }

    return toResponsableDto(user);
  }
}
