import { DomainNotFoundException, IUserRepository, User, UserRole } from '@rdc/domain';
import { IRefreshTokenSessionRepository } from '../../auth/interfaces/refresh-token-session.repository';
import { SupprimerResponsableUseCase } from './supprimer-responsable.usecase';

const RESPONSABLE_ID = '550e8400-e29b-41d4-a716-446655440000';

const responsableFixture = () =>
  User.create({
    id: RESPONSABLE_ID,
    email: 'resp@rdc.fr',
    passwordHash: 'h'.repeat(40),
    role: UserRole.RESPONSABLE_CENTRE,
    centreId: '660e8400-e29b-41d4-a716-446655440000',
    isActive: true,
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

describe('SupprimerResponsableUseCase', () => {
  let useCase: SupprimerResponsableUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new SupprimerResponsableUseCase(mockUsers, mockSessions);
  });

  it('désactive le responsable et révoque ses sessions', async () => {
    const user = responsableFixture();
    mockUsers.findById.mockResolvedValue(user);
    mockUsers.save.mockResolvedValue(undefined);
    mockSessions.revokeAllForUser.mockResolvedValue(undefined);

    await useCase.execute(RESPONSABLE_ID);

    expect(user.isActive).toBe(false);
    expect(mockUsers.save).toHaveBeenCalledWith(user);
    expect(mockSessions.revokeAllForUser).toHaveBeenCalledWith(RESPONSABLE_ID);
  });

  it('rejette si responsable introuvable', async () => {
    mockUsers.findById.mockResolvedValue(null);

    await expect(useCase.execute(RESPONSABLE_ID)).rejects.toThrow(DomainNotFoundException);
  });
});
