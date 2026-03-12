import { UserRole } from '@rdc/domain';

export interface AccessToken {
  token: string;
  expiresIn: number;
}

export interface RefreshToken {
  token: string;
  expiresIn: number;
  expiresAt: Date;
}

export interface AccessTokenPayload {
  sub: string;
  type: 'access';
  email: string;
  role: UserRole;
  centreId?: string;
  iat: number;
  exp: number;
}

export interface RefreshTokenPayload {
  sub: string;
  type: 'refresh';
  sid: string;
  iat: number;
  exp: number;
}

export interface ITokenService {
  getRefreshTtlSeconds(): number;
  signAccessToken(user: { id: string; email: string; role: UserRole; centreId?: string }): AccessToken;
  signRefreshToken(userId: string, sessionId: string): RefreshToken;
  verifyAccessToken(token: string): AccessTokenPayload | null;
  verifyRefreshToken(token: string): RefreshTokenPayload | null;
}
