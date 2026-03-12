import {
  DomainConflictException,
  DomainNotFoundException,
  ICentreRepository,
  IUserRepository,
  User,
  UserRole,
} from '@rdc/domain';
import { ModifierResponsableUseCase } from './modifier-responsable.usecase';
import { IPasswordHasher } from '../../auth/interfaces/password-hasher.port';
import { IRefreshTokenSessionRepository } from '../../auth/interfaces/refresh-token-session.repository';

const RESPONSABLE_ID = '550e8400-e29b-41d4-a716-446655440000';
const CENTRE_ID = '660e8400-e29b-41d4-a716-446655440000';

const responsableFixture = () =>
  User.create({
    id: RESPONSABLE_ID,
    email: 'resp@rdc.fr',
    passwordHash: 'h'.repeat(40),
    role: UserRole.RESPONSABLE_CENTRE,
    centreId: CENTRE_ID,
    isActive: true,
  });

const mockUsers: jest.Mocked<IUserRepository> = {
  findById: jest.fn(),
  findByEmail: jest.fn(),
  count: jest.fn(),
  findAllResponsables: jest.fn(),
  save: jest.fn(),
};

const mockCentres: jest.Mocked<ICentreRepository> = {
  findById: jest.fn(),
  findByUniqueKey: jest.fn(),
  findAll: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

const mockHasher: jest.Mocked<IPasswordHasher> = {
  hash: jest.fn(),
  verify: jest.fn(),
};

const mockSessions: jest.Mocked<IRefreshTokenSessionRepository> = {
  create: jest.fn(),
  findById: jest.fn(),
  revoke: jest.fn(),
  revokeAllForUser: jest.fn(),
};

describe('ModifierResponsableUseCase', () => {
  let useCase: ModifierResponsableUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new ModifierResponsableUseCase(mockUsers, mockCentres, mockHasher, mockSessions);
  });

  it('modifie l’email et révoque les sessions', async () => {
    mockUsers.findById.mockResolvedValue(responsableFixture());
    mockUsers.findByEmail.mockResolvedValue(null);
    mockUsers.save.mockResolvedValue(undefined);

    const result = await useCase.execute(RESPONSABLE_ID, { email: 'new-resp@rdc.fr' });

    expect(result.email).toBe('new-resp@rdc.fr');
    expect(mockSessions.revokeAllForUser).toHaveBeenCalledWith(RESPONSABLE_ID);
  });

  it('rejette si nouvel email déjà pris', async () => {
    mockUsers.findById.mockResolvedValue(responsableFixture());
    mockUsers.findByEmail.mockResolvedValue(
      User.create({
        id: '770e8400-e29b-41d4-a716-446655440000',
        email: 'new-resp@rdc.fr',
        passwordHash: 'h'.repeat(40),
        role: UserRole.RESPONSABLE_CENTRE,
        centreId: CENTRE_ID,
      }),
    );

    await expect(useCase.execute(RESPONSABLE_ID, { email: 'new-resp@rdc.fr' })).rejects.toThrow(DomainConflictException);
  });

  it('rejette si centre cible introuvable', async () => {
    mockUsers.findById.mockResolvedValue(responsableFixture());
    mockCentres.findById.mockResolvedValue(null);

    await expect(
      useCase.execute(RESPONSABLE_ID, { centreId: '990e8400-e29b-41d4-a716-446655440000' }),
    ).rejects.toThrow(DomainNotFoundException);
  });
});
