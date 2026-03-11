import { Centre, DomainNotFoundException } from '@rdc/shared';
import type { ICentreRepository } from '@rdc/shared';
import { ModifierCentreUseCase } from './modifier-centre.usecase';

const UUID = '550e8400-e29b-41d4-a716-446655440000';

const mockRepo: jest.Mocked<ICentreRepository> = {
  findById: jest.fn(),
  findByUniqueKey: jest.fn(),
  findAll: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

const centreFixture = () => Centre.create({
  id: UUID,
  nom: 'Centre Bordeaux',
  ville: 'Bordeaux',
  codePostal: '33000',
  adresse: '12 rue de la Paix',
});

describe('ModifierCentreUseCase', () => {
  let useCase: ModifierCentreUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new ModifierCentreUseCase(mockRepo);
  });

  it('modifie un centre et retourne le DTO mis à jour', async () => {
    mockRepo.findById.mockResolvedValue(centreFixture());
    mockRepo.save.mockResolvedValue(undefined);

    const result = await useCase.execute(UUID, { nom: 'Nouveau Nom' });

    expect(result.nom).toBe('Nouveau Nom');
    expect(result.ville).toBe('Bordeaux');
    expect(mockRepo.save).toHaveBeenCalledTimes(1);
  });

  it('ne modifie que les champs fournis', async () => {
    mockRepo.findById.mockResolvedValue(centreFixture());
    mockRepo.save.mockResolvedValue(undefined);

    const result = await useCase.execute(UUID, { ville: 'Paris' });

    expect(result.nom).toBe('Centre Bordeaux');
    expect(result.ville).toBe('Paris');
  });

  it('lève DomainNotFoundException si le centre est introuvable', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(UUID, { nom: 'Test' })).rejects.toThrow(DomainNotFoundException);
    expect(mockRepo.save).not.toHaveBeenCalled();
  });

  it('le code de l\'exception est CENTRE_NOT_FOUND', async () => {
    mockRepo.findById.mockResolvedValue(null);

    const error = await useCase.execute(UUID, { nom: 'Test' }).catch(e => e);
    expect(error.code).toBe('CENTRE_NOT_FOUND');
  });
});
