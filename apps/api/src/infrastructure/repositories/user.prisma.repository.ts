import { Injectable } from '@nestjs/common';
import { Email, IUserRepository, User, UserRole } from '@rdc/domain';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({ where: { id } });
    return data ? this.toDomain(data) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const data = await this.prisma.user.findUnique({ where: { email: email.value } });
    return data ? this.toDomain(data) : null;
  }

  async count(): Promise<number> {
    return this.prisma.user.count();
  }

  async findAllResponsables(filters?: { centreId?: string; isActive?: boolean }): Promise<User[]> {
    const data = await this.prisma.user.findMany({
      where: {
        role: 'RESPONSABLE_CENTRE',
        centreId: filters?.centreId,
        isActive: filters?.isActive,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return data.map(item => this.toDomain(item));
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        email: user.email.value,
        passwordHash: user.passwordHash,
        role: this.toPrismaRole(user.role),
        centreId: user.centreId,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      update: {
        email: user.email.value,
        passwordHash: user.passwordHash,
        role: this.toPrismaRole(user.role),
        centreId: user.centreId,
        isActive: user.isActive,
        updatedAt: user.updatedAt,
      },
    });
  }

  private toDomain(data: {
    id: string;
    email: string;
    passwordHash: string;
    role: string;
    centreId: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return User.reconstituer({
      id: data.id,
      email: Email.create(data.email),
      passwordHash: data.passwordHash,
      role: data.role as UserRole,
      centreId: data.centreId ?? undefined,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  private toPrismaRole(role: UserRole): 'ADMIN' | 'RESPONSABLE_CENTRE' {
    return role;
  }
}
