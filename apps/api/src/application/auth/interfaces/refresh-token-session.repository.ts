export interface RefreshTokenSession {
  id: string;
  tokenHash: string;
  userId: string;
  expiresAt: Date;
  revokedAt?: Date;
  replacedBy?: string;
}

export interface IRefreshTokenSessionRepository {
  create(session: RefreshTokenSession): Promise<void>;
  findById(id: string): Promise<RefreshTokenSession | null>;
  revoke(id: string, replacedBy?: string): Promise<void>;
  revokeAllForUser(userId: string): Promise<void>;
}
