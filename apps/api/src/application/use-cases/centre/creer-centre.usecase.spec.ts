import { Centre, DomainConflictException } from '@rdc/domain';
import type { ICentreRepository } from '@rdc/domain';
import { CreerCentreUseCase } from './creer-centre.usecase';

const UUID = '550e8400-e29b-41d4-a716-446655440000';

const mockRepo: jest.Mocked<ICentreRepository> = {
  findById: jest.fn(),
  findByUniqueKey: jest.fn(),
  findAll: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

const DTO = {
  nom: 'Centre Bordeaux',
  ville: 'Bordeaux',
  codePostal: '33000',
  adresse: '12 rue de la Paix',
};

describe('CreerCentreUseCase', () => {
  let useCase: CreerCentreUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreerCentreUseCase(mockRepo);
  });

  it('crée un centre et retourne le DTO', async () => {
    mockRepo.findByUniqueKey.mockResolvedValue(null);
    mockRepo.save.mockResolvedValue(undefined);

    const result = await useCase.execute(DTO);

    expect(result.nom.value).toBe('Centre Bordeaux');
    expect(result.ville.value).toBe('Bordeaux');
    expect(result.codePostal.value).toBe('33000');
    expect(result.statut).toBe('ACTIF');
    expect(result.id).toBeDefined();
    expect(mockRepo.save).toHaveBeenCalledTimes(1);
  });

  it('appelle findByUniqueKey avec les valeurs trimées', async () => {
    mockRepo.findByUniqueKey.mockResolvedValue(null);
    mockRepo.save.mockResolvedValue(undefined);

    await useCase.execute({ ...DTO, nom: '  Centre Bordeaux  ' });

    expect(mockRepo.findByUniqueKey).toHaveBeenCalledWith({
      nom: 'Centre Bordeaux',
      ville: 'Bordeaux',
      codePostal: '33000',
      adresse: '12 rue de la Paix',
    });
  });

  it('normalise le téléphone via le VO', async () => {
    mockRepo.findByUniqueKey.mockResolvedValue(null);
    mockRepo.save.mockResolvedValue(undefined);

    const result = await useCase.execute({ ...DTO, telephone: '06 12 34 56 78' });

    expect(result.telephone?.value).toBe('+33612345678');
  });

  it('normalise l\'email via le VO', async () => {
    mockRepo.findByUniqueKey.mockResolvedValue(null);
    mockRepo.save.mockResolvedValue(undefined);

    const result = await useCase.execute({ ...DTO, email: 'Contact@Test.FR' });

    expect(result.email?.value).toBe('contact@test.fr');
  });

  it('lève DomainConflictException si le centre existe déjà', async () => {
    const existant = Centre.create({ id: UUID, ...DTO });
    mockRepo.findByUniqueKey.mockResolvedValue(existant);

    await expect(useCase.execute(DTO)).rejects.toThrow(DomainConflictException);
    expect(mockRepo.save).not.toHaveBeenCalled();
  });

  it('le code de l\'exception est CENTRE_ALREADY_EXISTS', async () => {
    const existant = Centre.create({ id: UUID, ...DTO });
    mockRepo.findByUniqueKey.mockResolvedValue(existant);

    const error = await useCase.execute(DTO).catch(e => e);
    expect(error.code).toBe('CENTRE_ALREADY_EXISTS');
  });
});
