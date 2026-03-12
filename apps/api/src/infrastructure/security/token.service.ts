import { Injectable, Logger } from '@nestjs/common';
import { createHmac } from 'node:crypto';
import { UserRole } from '@rdc/domain';
import {
  AccessToken,
  AccessTokenPayload,
  ITokenService,
  RefreshToken,
  RefreshTokenPayload,
} from '../../application/auth/interfaces/token-service.port';

interface BaseTokenPayloadInternal {
  sub: string;
  type: 'access' | 'refresh';
  iat: number;
  exp: number;
}

@Injectable()
export class TokenService implements ITokenService {
  private readonly logger = new Logger(TokenService.name);

  private readonly accessSecret = process.env.AUTH_ACCESS_TOKEN_SECRET ?? 'dev-access-secret-change-me';
  private readonly refreshSecret = process.env.AUTH_REFRESH_TOKEN_SECRET ?? 'dev-refresh-secret-change-me';

  private readonly accessTtlSeconds = Number(process.env.AUTH_ACCESS_TOKEN_TTL_SECONDS ?? 900);
  private readonly refreshTtlSeconds = Number(process.env.AUTH_REFRESH_TOKEN_TTL_SECONDS ?? 604800);

  constructor() {
    if (!process.env.AUTH_ACCESS_TOKEN_SECRET || !process.env.AUTH_REFRESH_TOKEN_SECRET) {
      this.logger.warn('AUTH_*_TOKEN_SECRET manquant. Secrets de dev par defaut utilises.');
    }
  }

  getRefreshTtlSeconds(): number {
    return this.refreshTtlSeconds;
  }

  signAccessToken(user: { id: string; email: string; role: UserRole; centreId?: string }): AccessToken {
    const now = Math.floor(Date.now() / 1000);
    const payload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      centreId: user.centreId,
      type: 'access',
      iat: now,
      exp: now + this.accessTtlSeconds,
    };

    return {
      token: this.sign(payload, this.accessSecret),
      expiresIn: this.accessTtlSeconds,
    };
  }

  signRefreshToken(userId: string, sessionId: string): RefreshToken {
    const now = Math.floor(Date.now() / 1000);
    const payload: RefreshTokenPayload = {
      sub: userId,
      sid: sessionId,
      type: 'refresh',
      iat: now,
      exp: now + this.refreshTtlSeconds,
    };

    return {
      token: this.sign(payload, this.refreshSecret),
      expiresIn: this.refreshTtlSeconds,
      expiresAt: new Date(payload.exp * 1000),
    };
  }

  verifyAccessToken(token: string): AccessTokenPayload | null {
    const payload = this.verify(token, this.accessSecret);
    if (!this.isAccessPayload(payload)) {
      return null;
    }

    return payload;
  }

  verifyRefreshToken(token: string): RefreshTokenPayload | null {
    const payload = this.verify(token, this.refreshSecret);
    if (!this.isRefreshPayload(payload)) {
      return null;
    }

    return payload;
  }

  private sign(payload: object, secret: string): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const headerB64 = this.toBase64Url(JSON.stringify(header));
    const payloadB64 = this.toBase64Url(JSON.stringify(payload));
    const signature = createHmac('sha256', secret)
      .update(`${headerB64}.${payloadB64}`)
      .digest('base64url');

    return `${headerB64}.${payloadB64}.${signature}`;
  }

  private verify(token: string, secret: string): unknown {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [headerB64, payloadB64, signature] = parts;
    const expected = createHmac('sha256', secret)
      .update(`${headerB64}.${payloadB64}`)
      .digest('base64url');

    if (expected !== signature) {
      return null;
    }

    try {
      const payloadText = Buffer.from(payloadB64, 'base64url').toString('utf8');
      const payload = JSON.parse(payloadText) as { exp?: unknown };
      if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) {
        return null;
      }
      return payload;
    } catch {
      return null;
    }
  }

  private toBase64Url(value: string): string {
    return Buffer.from(value).toString('base64url');
  }

  private isAccessPayload(payload: unknown): payload is AccessTokenPayload {
    if (!payload || typeof payload !== 'object') {
      return false;
    }

    const record = payload as Partial<AccessTokenPayload>;
    return (
      record.type === 'access' &&
      typeof record.sub === 'string' &&
      typeof record.email === 'string' &&
      (record.role === UserRole.ADMIN || record.role === UserRole.RESPONSABLE_CENTRE) &&
      (record.centreId === undefined || typeof record.centreId === 'string') &&
      typeof record.iat === 'number' &&
      typeof record.exp === 'number'
    );
  }

  private isRefreshPayload(payload: unknown): payload is RefreshTokenPayload {
    if (!payload || typeof payload !== 'object') {
      return false;
    }

    const record = payload as Partial<RefreshTokenPayload & BaseTokenPayloadInternal>;
    return (
      record.type === 'refresh' &&
      typeof record.sub === 'string' &&
      typeof record.sid === 'string' &&
      typeof record.iat === 'number' &&
      typeof record.exp === 'number'
    );
  }
}
