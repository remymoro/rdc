import { Inject, Injectable } from '@nestjs/common';
import { DomainNotFoundException, IUserRepository, UserRole } from '@rdc/domain';
import { IRefreshTokenSessionRepository } from '../../auth/interfaces/refresh-token-session.repository';

@Injectable()
export class SupprimerResponsableUseCase {
  constructor(
    @Inject('IUserRepository') private readonly users: IUserRepository,
    @Inject('IRefreshTokenSessionRepository') private readonly sessions: IRefreshTokenSessionRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const user = await this.users.findById(id);

    if (!user || user.role !== UserRole.RESPONSABLE_CENTRE || !user.centreId) {
      throw new DomainNotFoundException('Responsable centre introuvable', 'RESPONSABLE_NOT_FOUND');
    }

    user.deactivate();
    await this.users.save(user);
    await this.sessions.revokeAllForUser(user.id);
  }
}
