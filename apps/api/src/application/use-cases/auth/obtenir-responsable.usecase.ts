import { Inject, Injectable } from '@nestjs/common';
import { DomainNotFoundException, IUserRepository, User, UserRole } from '@rdc/domain';

@Injectable()
export class ObtenirResponsableUseCase {
  constructor(@Inject('IUserRepository') private readonly users: IUserRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.users.findById(id);

    if (!user || user.role !== UserRole.RESPONSABLE_CENTRE || !user.centreId) {
      throw new DomainNotFoundException('Responsable centre introuvable', 'RESPONSABLE_NOT_FOUND');
    }

    return user;
  }
}
