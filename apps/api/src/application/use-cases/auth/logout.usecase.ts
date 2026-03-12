import { Inject, Injectable } from '@nestjs/common';
import { IRefreshTokenSessionRepository } from '../../auth/interfaces/refresh-token-session.repository';
import { ITokenService } from '../../auth/interfaces/token-service.port';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject('IRefreshTokenSessionRepository') private readonly sessions: IRefreshTokenSessionRepository,
    @Inject('ITokenService') private readonly tokenService: ITokenService,
  ) {}

  async execute(rawRefreshToken?: string): Promise<void> {
    if (!rawRefreshToken) {
      return;
    }

    const payload = this.tokenService.verifyRefreshToken(rawRefreshToken);
    if (!payload) {
      return;
    }

    await this.sessions.revoke(payload.sid);
  }
}
