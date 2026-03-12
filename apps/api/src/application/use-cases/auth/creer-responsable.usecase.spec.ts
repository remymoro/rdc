import {
  Centre,
  DomainConflictException,
  DomainNotFoundException,
  ICentreRepository,
  IUserRepository,
  User,
  UserRole,
} from '@rdc/domain';
import { CreerResponsableUseCase } from './creer-responsable.usecase';
import { IPasswordHasher } from '../../auth/interfaces/password-hasher.port';

const CENTRE_ID = '660e8400-e29b-41d4-a716-446655440000';

const centreFixture = () =>
  Centre.create({
    id: CENTRE_ID,
    nom: 'Centre Paris',
    ville: 'Paris',
    codePostal: '75011',
    adresse: '10 rue Oberkampf',
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

describe('CreerResponsableUseCase', () => {
  let useCase: CreerResponsableUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreerResponsableUseCase(mockUsers, mockCentres, mockHasher);
  });

  it('crée un responsable rattaché au centre', async () => {
    mockUsers.findByEmail.mockResolvedValue(null);
    mockCentres.findById.mockResolvedValue(centreFixture());
    mockHasher.hash.mockReturnValue('h'.repeat(40));
    mockUsers.save.mockResolvedValue(undefined);

    const result = await useCase.execute({
      email: 'resp@rdc.fr',
      password: 'Responsable123!',
      centreId: CENTRE_ID,
    });

    expect(result.role).toBe('RESPONSABLE_CENTRE');
    expect(result.centreId).toBe(CENTRE_ID);
    expect(mockUsers.save).toHaveBeenCalledTimes(1);
  });

  it('rejette si email déjà existant', async () => {
    mockUsers.findByEmail.mockResolvedValue(
      User.create({
        id: '770e8400-e29b-41d4-a716-446655440000',
        email: 'resp@rdc.fr',
        passwordHash: 'h'.repeat(40),
        role: UserRole.RESPONSABLE_CENTRE,
        centreId: CENTRE_ID,
      }),
    );

    await expect(
      useCase.execute({ email: 'resp@rdc.fr', password: 'Responsable123!', centreId: CENTRE_ID }),
    ).rejects.toThrow(DomainConflictException);
  });

  it('rejette si centre introuvable', async () => {
    mockUsers.findByEmail.mockResolvedValue(null);
    mockCentres.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ email: 'resp@rdc.fr', password: 'Responsable123!', centreId: CENTRE_ID }),
    ).rejects.toThrow(DomainNotFoundException);
  });
});
