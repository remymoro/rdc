import { DomainConflictException, IUserRepository, User, UserRole } from '@rdc/domain';
import { BootstrapAdminUseCase } from './bootstrap-admin.usecase';
import { IPasswordHasher } from '../../auth/interfaces/password-hasher.port';

const mockUsers: jest.Mocked<IUserRepository> = {
  findById: jest.fn(),
  findByEmail: jest.fn(),
  count: jest.fn(),
  findAllResponsables: jest.fn(),
  save: jest.fn(),
};

const mockHasher: jest.Mocked<IPasswordHasher> = {
  hash: jest.fn(),
  verify: jest.fn(),
};

describe('BootstrapAdminUseCase', () => {
  let useCase: BootstrapAdminUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new BootstrapAdminUseCase(mockUsers, mockHasher);
  });

  it('crée un admin si aucun utilisateur n’existe', async () => {
    mockUsers.count.mockResolvedValue(0);
    mockHasher.hash.mockReturnValue('h'.repeat(40));
    mockUsers.save.mockResolvedValue(undefined);

    await useCase.execute('admin@rdc.fr', 'AdminPassword123!');

    expect(mockHasher.hash).toHaveBeenCalledWith('AdminPassword123!');
    expect(mockUsers.save).toHaveBeenCalledTimes(1);

    const saved = mockUsers.save.mock.calls[0][0] as User;
    expect(saved.role).toBe(UserRole.ADMIN);
    expect(saved.email.value).toBe('admin@rdc.fr');
    expect(saved.isActive).toBe(true);
  });

  it('refuse le bootstrap si un utilisateur existe déjà', async () => {
    mockUsers.count.mockResolvedValue(1);

    await expect(useCase.execute('admin@rdc.fr', 'AdminPassword123!')).rejects.toThrow(DomainConflictException);
    expect(mockUsers.save).not.toHaveBeenCalled();
  });
});
