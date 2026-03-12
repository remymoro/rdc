import { Inject, Injectable } from '@nestjs/common';
import { DomainValidationException, IUserRepository } from '@rdc/domain';
import type { AuthTokenDto, AuthUserDto } from '@rdc/shared';
import { randomUUID } from 'node:crypto';
import { IRefreshTokenSessionRepository } from '../../auth/interfaces/refresh-token-session.repository';
import { IPasswordHasher } from '../../auth/interfaces/password-hasher.port';
import { ITokenService } from '../../auth/interfaces/token-service.port';

export interface RefreshResult {
  auth: AuthTokenDto;
  user: AuthUserDto;
  refreshToken: string;
}

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject('IUserRepository') private readonly users: IUserRepository,
    @Inject('IRefreshTokenSessionRepository') private readonly sessions: IRefreshTokenSessionRepository,
    @Inject('IPasswordHasher') private readonly passwordHasher: IPasswordHasher,
    @Inject('ITokenService') private readonly tokenService: ITokenService,
  ) {}

  async execute(rawRefreshToken: string): Promise<RefreshResult> {
    const payload = this.tokenService.verifyRefreshToken(rawRefreshToken);
    if (!payload) {
      throw new DomainValidationException('Refresh token invalide', 'AUTH_REFRESH_INVALID');
    }

    const session = await this.sessions.findById(payload.sid);
    if (!session || session.revokedAt || session.expiresAt.getTime() <= Date.now()) {
      throw new DomainValidationException('Session expiree ou revoquee', 'AUTH_REFRESH_INVALID');
    }

    if (!this.passwordHasher.verify(rawRefreshToken, session.tokenHash)) {
      await this.sessions.revoke(session.id);
      throw new DomainValidationException('Session invalide', 'AUTH_REFRESH_INVALID');
    }

    const user = await this.users.findById(session.userId);
    if (!user || !user.isActive) {
      throw new DomainValidationException('Utilisateur invalide', 'AUTH_USER_INVALID');
    }

    const newSid = randomUUID();
    const refresh = this.tokenService.signRefreshToken(user.id, newSid);

    await this.sessions.revoke(session.id, newSid);
    await this.sessions.create({
      id: newSid,
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
