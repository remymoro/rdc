import { Injectable } from '@nestjs/common';
import { IRefreshTokenSessionRepository, RefreshTokenSession } from '../../application/auth/interfaces/refresh-token-session.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RefreshTokenSessionPrismaRepository implements IRefreshTokenSessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(session: RefreshTokenSession): Promise<void> {
    await this.prisma.refreshTokenSession.create({
      data: {
        id: session.id,
        tokenHash: session.tokenHash,
        userId: session.userId,
        expiresAt: session.expiresAt,
        revokedAt: session.revokedAt,
        replacedBy: session.replacedBy,
      },
    });
  }

  async findById(id: string): Promise<RefreshTokenSession | null> {
    const data = await this.prisma.refreshTokenSession.findUnique({ where: { id } });
    if (!data) {
      return null;
    }

    return {
      id: data.id,
      tokenHash: data.tokenHash,
      userId: data.userId,
      expiresAt: data.expiresAt,
      revokedAt: data.revokedAt ?? undefined,
      replacedBy: data.replacedBy ?? undefined,
    };
  }

  async revoke(id: string, replacedBy?: string): Promise<void> {
    await this.prisma.refreshTokenSession.updateMany({
      where: { id, revokedAt: null },
      data: {
        revokedAt: new Date(),
        replacedBy,
      },
    });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.refreshTokenSession.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
}
