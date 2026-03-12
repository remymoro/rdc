import { Inject, Injectable } from '@nestjs/common';
import { DomainConflictException, IUserRepository, User, UserRole } from '@rdc/domain';
import { randomUUID } from 'node:crypto';
import { IPasswordHasher } from '../../auth/interfaces/password-hasher.port';

@Injectable()
export class BootstrapAdminUseCase {
  constructor(
    @Inject('IUserRepository') private readonly users: IUserRepository,
    @Inject('IPasswordHasher') private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(email: string, password: string): Promise<void> {
    const userCount = await this.users.count();
    if (userCount > 0) {
      throw new DomainConflictException('Bootstrap admin deja effectue', 'AUTH_BOOTSTRAP_DISABLED');
    }

    const user = User.create({
      id: randomUUID(),
      email,
      passwordHash: this.passwordHasher.hash(password),
      role: UserRole.ADMIN,
      isActive: true,
    });

    await this.users.save(user);
  }
}
