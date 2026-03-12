import { Inject, Injectable } from '@nestjs/common';
import { CentreId, DomainConflictException, DomainNotFoundException, Email, ICentreRepository, IUserRepository, User, UserRole } from '@rdc/domain';
import type { CreerResponsableCentreDto, ResponsableCentreDto } from '@rdc/shared';
import { randomUUID } from 'node:crypto';
import { IPasswordHasher } from '../../auth/interfaces/password-hasher.port';
import { toResponsableDto } from './responsable-centre.mapper';

@Injectable()
export class CreerResponsableUseCase {
  constructor(
    @Inject('IUserRepository') private readonly users: IUserRepository,
    @Inject('ICentreRepository') private readonly centres: ICentreRepository,
    @Inject('IPasswordHasher') private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(params: CreerResponsableCentreDto): Promise<ResponsableCentreDto> {
    const email = Email.create(params.email);
    const existing = await this.users.findByEmail(email);

    if (existing) {
      throw new DomainConflictException('Un utilisateur avec cet email existe deja', 'AUTH_EMAIL_ALREADY_EXISTS');
    }

    const centreId = CentreId.create(params.centreId);
    const centre = await this.centres.findById(centreId);
    if (!centre) {
      throw new DomainNotFoundException('Centre introuvable', 'CENTRE_NOT_FOUND');
    }

    const user = User.create({
      id: randomUUID(),
      email: email.value,
      passwordHash: this.passwordHasher.hash(params.password),
      role: UserRole.RESPONSABLE_CENTRE,
      centreId: centre.id.value,
      isActive: true,
    });

    await this.users.save(user);

    return toResponsableDto(user);
  }
}
