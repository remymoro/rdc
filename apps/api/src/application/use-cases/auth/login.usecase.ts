import { Inject, Injectable } from '@nestjs/common';
import { DomainValidationException, Email, IUserRepository, UserRole } from '@rdc/domain';
import { randomUUID } from 'node:crypto';
import { IRefreshTokenSessionRepository } from '../../auth/interfaces/refresh-token-session.repository';
import { IPasswordHasher } from '../../auth/interfaces/password-hasher.port';
import { ITokenService } from '../../auth/interfaces/token-service.port';

export interface LoginResult {
  auth: { accessToken: string; tokenType: 'Bearer'; expiresIn: number };
  user: { id: string; email: string; role: UserRole; centreId?: string };
  refreshToken: string;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('IUserRepository') private readonly users: IUserRepository,
    @Inject('IRefreshTokenSessionRepository') private readonly sessions: IRefreshTokenSessionRepository,
    @Inject('IPasswordHasher') private readonly passwordHasher: IPasswordHasher,
    @Inject('ITokenService') private readonly tokenService: ITokenService,
  ) {}

  async execute(dto: { email: string; password: string }): Promise<LoginResult> {
    const email = Email.create(dto.email);
    const user = await this.users.findByEmail(email);

    if (!user || !this.passwordHasher.verify(dto.password, user.passwordHash)) {
      throw new DomainValidationException('Identifiants invalides', 'AUTH_INVALID_CREDENTIALS');
    }

    if (!user.isActive) {
      throw new DomainValidationException('Compte desactive', 'AUTH_USER_INACTIVE');
    }

    const sid = randomUUID();
    const refresh = this.tokenService.signRefreshToken(user.id, sid);

    await this.sessions.create({
      id: sid,
      tokenHash: this.passwordHasher.hash(refresh.token),
      userId: user.id,
      expiresAt: refresh.expiresAt,
    });

    const access = this.tokenService.signAccessToken({
      id: user.id,
      email: user.email.value,
      role: user.role,
      centreId: user.centreId,
    });

    return {
      auth: {
        accessToken: access.token,
        tokenType: 'Bearer',
        expiresIn: access.expiresIn,
      },
      user: {
        id: user.id,
        email: user.email.value,
        role: user.role,
        centreId: user.centreId,
      },
      refreshToken: refresh.token,
    };
  }
}
