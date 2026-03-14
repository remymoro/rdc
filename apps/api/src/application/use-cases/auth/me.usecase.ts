import { Inject, Injectable } from '@nestjs/common';
import { DomainNotFoundException, IUserRepository, User } from '@rdc/domain';

@Injectable()
export class MeUseCase {
  constructor(@Inject('IUserRepository') private readonly users: IUserRepository) {}

  async execute(userId: string): Promise<User> {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new DomainNotFoundException('Utilisateur introuvable', 'AUTH_USER_NOT_FOUND');
    }

    return user;
  }
}
