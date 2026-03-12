import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '@rdc/domain';
import type { ResponsableCentreDto } from '@rdc/shared';
import { toResponsableDto } from './responsable-centre.mapper';

@Injectable()
export class ListerResponsablesUseCase {
  constructor(@Inject('IUserRepository') private readonly users: IUserRepository) {}

  async execute(filters?: { centreId?: string; isActive?: boolean }): Promise<ResponsableCentreDto[]> {
    const responsables = await this.users.findAllResponsables(filters);
    return responsables.map(toResponsableDto);
  }
}
