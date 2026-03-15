import {
  Collecte,
  DomainConflictException,
  type ICollecteRepository,
  StatutCollecte,
} from '@rdc/domain';
import { CreerCollecteUseCase } from './creer-collecte.usecase';

const DATE_DEBUT = new Date('2026-03-06T00:00:00.000Z');
const DATE_FIN = new Date('2026-03-08T00:00:00.000Z');
const DATE_FIN_SAISIE = new Date('2026-03-15T00:00:00.000Z');

const DTO = {
  nom: 'Collecte nationale 2026',
  dateDebut: DATE_DEBUT,
  dateFin: DATE_FIN,
  dateFinSaisie: DATE_FIN_SAISIE,
};

const mockRepo: jest.Mocked<ICollecteRepository> = {
  findById: jest.fn(),
  findAll: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

function creerCollecteExistante() {
  return Collecte.create({
    id: '550e8400-e29b-41d4-a716-446655440000',
    ...DTO,
  });
}

describe('CreerCollecteUseCase', () => {
  let useCase: CreerCollecteUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreerCollecteUseCase(mockRepo);
  });

  it('crée et sauvegarde une collecte', async () => {
    mockRepo.findAll.mockResolvedValue([]);
    mockRepo.save.mockResolvedValue(undefined);

    await useCase.execute(DTO);

    expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
    expect(mockRepo.save).toHaveBeenCalledTimes(1);
    expect(mockRepo.save.mock.calls[0][0]).toBeInstanceOf(Collecte);
  });

  it('retourne le DTO de collecte avec les bons champs', async () => {
    mockRepo.findAll.mockResolvedValue([]);
    mockRepo.save.mockResolvedValue(undefined);

    const result = await useCase.execute(DTO);

    expect(result.nom.value).toBe('Collecte nationale 2026');
    expect(result.periode.dateDebut).toEqual(DATE_DEBUT);
    expect(result.periode.dateFin).toEqual(DATE_FIN);
    expect(result.periode.dateFinSaisie).toEqual(DATE_FIN_SAISIE);
    expect(result.statut).toBe(StatutCollecte.PREPARATION);
    expect(result.participations).toEqual([]);
  });

  it('lève une exception si le nom est déjà utilisé', async () => {
    mockRepo.findAll.mockResolvedValue([creerCollecteExistante()]);

    await expect(useCase.execute(DTO)).rejects.toThrow(DomainConflictException);

    const error = await useCase.execute(DTO).catch(e => e);
    expect(error.message).toBe('Une collecte "Collecte nationale 2026" existe déjà');
    expect(error.code).toBe('COLLECTE_ALREADY_EXISTS');
    expect(mockRepo.save).not.toHaveBeenCalled();
  });
});
