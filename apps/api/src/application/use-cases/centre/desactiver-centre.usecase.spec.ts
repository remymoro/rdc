import { Centre, DomainNotFoundException, StatutCentre } from '@rdc/domain';
import type { ICentreRepository } from '@rdc/domain';
import { DesactiverCentreUseCase } from './desactiver-centre.usecase';

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

describe('DesactiverCentreUseCase', () => {
  let useCase: DesactiverCentreUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new DesactiverCentreUseCase(mockRepo);
  });

  it('désactive un centre ACTIF', async () => {
    const centre = centreFixture();
    mockRepo.findById.mockResolvedValue(centre);
    mockRepo.save.mockResolvedValue(undefined);

    await useCase.execute(UUID);

    expect(centre.statut).toBe(StatutCentre.INACTIF);
    expect(mockRepo.save).toHaveBeenCalledWith(centre);
  });

  it('lève DomainNotFoundException si le centre est introuvable', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(UUID)).rejects.toThrow(DomainNotFoundException);
    expect(mockRepo.save).not.toHaveBeenCalled();
  });

  it('le code de l\'exception est CENTRE_NOT_FOUND', async () => {
    mockRepo.findById.mockResolvedValue(null);

    const error = await useCase.execute(UUID).catch(e => e);
    expect(error.code).toBe('CENTRE_NOT_FOUND');
  });
});
