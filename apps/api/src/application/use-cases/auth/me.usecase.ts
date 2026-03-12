import { Inject, Injectable } from '@nestjs/common';
import { DomainNotFoundException, IUserRepository } from '@rdc/domain';
import type { AuthUserDto } from '@rdc/shared';

@Injectable()
export class MeUseCase {
  constructor(@Inject('IUserRepository') private readonly users: IUserRepository) {}

  async execute(userId: string): Promise<AuthUserDto> {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new DomainNotFoundException('Utilisateur introuvable', 'AUTH_USER_NOT_FOUND');
    }

    return {
      id: user.id,
      email: user.email.value,
      role: user.role,
      centreId: user.centreId,
    };
  }
}
