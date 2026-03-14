import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository, User } from '@rdc/domain';

@Injectable()
export class ListerResponsablesUseCase {
  constructor(@Inject('IUserRepository') private readonly users: IUserRepository) {}

  async execute(filters?: { centreId?: string; isActive?: boolean }): Promise<User[]> {
    return this.users.findAllResponsables(filters);
  }
}
