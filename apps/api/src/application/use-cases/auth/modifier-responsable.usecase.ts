import { Inject, Injectable } from '@nestjs/common';
import {
  CentreId,
  DomainConflictException,
  DomainNotFoundException,
  Email,
  ICentreRepository,
  IUserRepository,
  User,
  UserRole,
} from '@rdc/domain';
import type { ModifierResponsableCentreDto, ResponsableCentreDto } from '@rdc/shared';
import { IPasswordHasher } from '../../auth/interfaces/password-hasher.port';
import { IRefreshTokenSessionRepository } from '../../auth/interfaces/refresh-token-session.repository';
import { toResponsableDto } from './responsable-centre.mapper';

@Injectable()
export class ModifierResponsableUseCase {
  constructor(
    @Inject('IUserRepository') private readonly users: IUserRepository,
    @Inject('ICentreRepository') private readonly centres: ICentreRepository,
    @Inject('IPasswordHasher') private readonly passwordHasher: IPasswordHasher,
    @Inject('IRefreshTokenSessionRepository') private readonly sessions: IRefreshTokenSessionRepository,
  ) {}

  async execute(id: string, dto: ModifierResponsableCentreDto): Promise<ResponsableCentreDto> {
    let user = await this.users.findById(id);

    if (!user || user.role !== UserRole.RESPONSABLE_CENTRE || !user.centreId) {
      throw new DomainNotFoundException('Responsable centre introuvable', 'RESPONSABLE_NOT_FOUND');
    }

    let mustRevokeSessions = false;

    if (dto.email && dto.email !== user.email.value) {
      const newEmail = Email.create(dto.email);
      const existing = await this.users.findByEmail(newEmail);
      if (existing && existing.id !== user.id) {
        throw new DomainConflictException('Un utilisateur avec cet email existe deja', 'AUTH_EMAIL_ALREADY_EXISTS');
      }

      user = User.reconstituer({
        id: user.id,
        email: newEmail,
        passwordHash: user.passwordHash,
        role: user.role,
        centreId: user.centreId,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: new Date(),
      });
      mustRevokeSessions = true;
    }

    if (dto.password) {
      user.setPasswordHash(this.passwordHasher.hash(dto.password));
      mustRevokeSessions = true;
    }

    if (dto.centreId && dto.centreId !== user.centreId) {
      const centre = await this.centres.findById(CentreId.create(dto.centreId));
      if (!centre) {
        throw new DomainNotFoundException('Centre introuvable', 'CENTRE_NOT_FOUND');
      }

      user = User.reconstituer({
        id: user.id,
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role,
        centreId: centre.id.value,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: new Date(),
      });
    }

    if (dto.isActive !== undefined && dto.isActive !== user.isActive) {
      if (dto.isActive) {
        user.activate();
      } else {
        user.deactivate();
        mustRevokeSessions = true;
      }
    }

    await this.users.save(user);

    if (mustRevokeSessions) {
      await this.sessions.revokeAllForUser(user.id);
    }

    return toResponsableDto(user);
  }
}
