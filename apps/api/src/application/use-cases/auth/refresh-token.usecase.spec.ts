import { DomainValidationException, IUserRepository, User, UserRole } from '@rdc/domain';
import { RefreshTokenUseCase } from './refresh-token.usecase';
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

describe('RefreshTokenUseCase', () => {
  let useCase: RefreshTokenUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RefreshTokenUseCase(mockUsers, mockSessions, mockHasher, mockTokenService);
  });

  it('rotates refresh token et retourne un nouvel access token', async () => {
    const user = buildUser();
    const session = {
      id: 'sid-1',
      tokenHash: 'hashed-old',
      userId: user.id,
      expiresAt: new Date(Date.now() + 60_000),
    };

    mockTokenService.verifyRefreshToken.mockReturnValue({
      sub: user.id,
      sid: session.id,
      type: 'refresh',
      iat: 0,
      exp: 9999999999,
    });
    mockSessions.findById.mockResolvedValue(session);
    mockHasher.verify.mockReturnValue(true);
    mockUsers.findById.mockResolvedValue(user);
    mockTokenService.signRefreshToken.mockReturnValue({
      token: 'new-refresh',
      expiresIn: 604800,
      expiresAt: new Date(Date.now() + 120_000),
    });
    mockHasher.hash.mockReturnValue('hashed-new-refresh');
    mockTokenService.signAccessToken.mockReturnValue({ token: 'new-access', expiresIn: 900 });

    const result = await useCase.execute('old-refresh');

    expect(result.auth.accessToken).toBe('new-access');
    expect(mockSessions.revoke).toHaveBeenCalledWith('sid-1', expect.any(String));
    expect(mockSessions.create).toHaveBeenCalledTimes(1);
  });

  it('rejette un refresh token invalide', async () => {
    mockTokenService.verifyRefreshToken.mockReturnValue(null);

    await expect(useCase.execute('bad-token')).rejects.toThrow(DomainValidationException);
    expect(mockSessions.findById).not.toHaveBeenCalled();
  });

  it('révoque et rejette si hash de session invalide', async () => {
    const user = buildUser();
    mockTokenService.verifyRefreshToken.mockReturnValue({
      sub: user.id,
      sid: 'sid-1',
      type: 'refresh',
      iat: 0,
      exp: 9999999999,
    });
    mockSessions.findById.mockResolvedValue({
      id: 'sid-1',
      tokenHash: 'expected-hash',
      userId: user.id,
      expiresAt: new Date(Date.now() + 60_000),
    });
    mockHasher.verify.mockReturnValue(false);

    await expect(useCase.execute('token')).rejects.toThrow(DomainValidationException);
    expect(mockSessions.revoke).toHaveBeenCalledWith('sid-1');
  });
});
