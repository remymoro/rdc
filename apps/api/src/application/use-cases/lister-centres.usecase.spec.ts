import { Centre } from '@rdc/shared';
import type { ICentreRepository } from '@rdc/shared';
import { ListerCentresUseCase } from './lister-centres.usecase';

const mockRepo: jest.Mocked<ICentreRepository> = {
  findById: jest.fn(),
  findByUniqueKey: jest.fn(),
  findAll: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

const centreFixture = (id: string, nom: string) => Centre.create({
  id,
  nom,
  ville: 'Bordeaux',
  codePostal: '33000',
  adresse: '12 rue de la Paix',
});

describe('ListerCentresUseCase', () => {
  let useCase: ListerCentresUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new ListerCentresUseCase(mockRepo);
  });

  it('retourne un tableau vide si aucun centre', async () => {
    mockRepo.findAll.mockResolvedValue([]);
    expect(await useCase.execute()).toEqual([]);
  });

  it('mappe les entités en DTOs avec les valeurs des VOs', async () => {
    const centres = [
      centreFixture('550e8400-e29b-41d4-a716-446655440000', 'Centre A'),
      centreFixture('660e8400-e29b-41d4-a716-446655440000', 'Centre B'),
    ];
    mockRepo.findAll.mockResolvedValue(centres);

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result[0].nom).toBe('Centre A');
    expect(result[0].ville).toBe('Bordeaux');
    expect(result[0].statut).toBe('ACTIF');
    expect(result[1].nom).toBe('Centre B');
  });

  it('retourne les champs optionnels undefined si absents', async () => {
    mockRepo.findAll.mockResolvedValue([
      centreFixture('550e8400-e29b-41d4-a716-446655440000', 'Centre A'),
    ]);

    const result = await useCase.execute();

    expect(result[0].telephone).toBeUndefined();
    expect(result[0].email).toBeUndefined();
  });
});
