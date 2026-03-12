import {
  IUserRepository,
  User,
  UserRole,
  DomainValidationException,
} from '@rdc/domain';
import { LoginUseCase } from './login.usecase';
import { IPasswordHasher } from '../../auth/interfaces/password-hasher.port';
import {
  ITokenService,
  AccessToken,
  RefreshToken,
  AccessTokenPayload,
  RefreshTokenPayload,
} from '../../auth/interfaces/token-service.port';
import {
  IRefreshTokenSessionRepository,
} from '../../auth/interfaces/refresh-token-session.repository';

const now = new Date('2026-03-12T10:00:00.000Z');

const buildUser = (overrides?: Partial<{ isActive: boolean }>) =>
  User.create({
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'resp@rdc.fr',
    passwordHash: 'h'.repeat(40),
    role: UserRole.RESPONSABLE_CENTRE,
    centreId: '660e8400-e29b-41d4-a716-446655440000',
    isActive: overrides?.isActive ?? true,
  });

const mockUsers: jest.Mocked<IUserRepository> = {
  findById: jest.fn(),
  findByEmail: jest.fn(),
  count: jest.fn(),
  findAllResponsables: jest.fn(),
  save: jest.fn(),
};

const mockSessions: jest.Mocked<IRefreshTokenSessionRepository> = {
  create: jest.fn(),
  findById: jest.fn(),
  revoke: jest.fn(),
  revokeAllForUser: jest.fn(),
};

const mockHasher: jest.Mocked<IPasswordHasher> = {
  hash: jest.fn(),
  verify: jest.fn(),
};

const mockTokenService: jest.Mocked<ITokenService> = {
  getRefreshTtlSeconds: jest.fn(),
  signAccessToken: jest.fn<AccessToken, [Parameters<ITokenService['signAccessToken']>[0]]>(),
  signRefreshToken: jest.fn<RefreshToken, [string, string]>(),
  verifyAccessToken: jest.fn<AccessTokenPayload | null, [string]>(),
  verifyRefreshToken: jest.fn<RefreshTokenPayload | null, [string]>(),
};

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new LoginUseCase(mockUsers, mockSessions, mockHasher, mockTokenService);
  });

  it('retourne access+refresh et crée la session', async () => {
    const user = buildUser();
    mockUsers.findByEmail.mockResolvedValue(user);
    mockHasher.verify.mockReturnValue(true);
    mockTokenService.signRefreshToken.mockReturnValue({
      token: 'refresh-token',
      expiresIn: 60 * 60 * 24,
      expiresAt: now,
    });
    mockHasher.hash.mockReturnValue('hashed-refresh-token');
    mockTokenService.signAccessToken.mockReturnValue({
      token: 'access-token',
      expiresIn: 900,
    });
    mockSessions.create.mockResolvedValue(undefined);

    const result = await useCase.execute({ email: 'resp@rdc.fr', password: 'Password123!' });

    expect(result.auth.accessToken).toBe('access-token');
    expect(result.user.role).toBe('RESPONSABLE_CENTRE');
    expect(result.user.centreId).toBe('660e8400-e29b-41d4-a716-446655440000');
    expect(mockSessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        tokenHash: 'hashed-refresh-token',
        userId: user.id,
      }),
    );
  });

  it('rejette si credentials invalides', async () => {
    mockUsers.findByEmail.mockResolvedValue(buildUser());
    mockHasher.verify.mockReturnValue(false);

    await expect(useCase.execute({ email: 'resp@rdc.fr', password: 'bad' })).rejects.toThrow(DomainValidationException);
    expect(mockSessions.create).not.toHaveBeenCalled();
  });

  it('rejette si utilisateur inactif', async () => {
    mockUsers.findByEmail.mockResolvedValue(buildUser({ isActive: false }));
    mockHasher.verify.mockReturnValue(true);

    await expect(useCase.execute({ email: 'resp@rdc.fr', password: 'Password123!' })).rejects.toThrow(
      DomainValidationException,
    );
    expect(mockSessions.create).not.toHaveBeenCalled();
  });
});
