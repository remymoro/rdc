import {
  Collecte,
  DomainNotFoundException,
  DomainValidationException,
  type ICollecteRepository,
  StatutCollecte,
} from '@rdc/domain';
import { OuvrirInscriptionsUseCase } from './ouvrir-inscriptions.usecase';

const UUID = '550e8400-e29b-41d4-a716-446655440000';

const mockRepo: jest.Mocked<ICollecteRepository> = {
  findById: jest.fn(),
  findAll: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

function creerCollecte(statut = StatutCollecte.PREPARATION): Collecte {
  return Collecte.reconstituer({
    id: Collecte.create({
      id: UUID,
      nom: 'Collecte nationale 2026',
      dateDebut: new Date('2026-03-06T00:00:00.000Z'),
      dateFin: new Date('2026-03-08T00:00:00.000Z'),
      dateFinSaisie: new Date('2026-03-15T00:00:00.000Z'),
    }).id,
    nom: Collecte.create({
      id: UUID,
      nom: 'Collecte nationale 2026',
      dateDebut: new Date('2026-03-06T00:00:00.000Z'),
      dateFin: new Date('2026-03-08T00:00:00.000Z'),
      dateFinSaisie: new Date('2026-03-15T00:00:00.000Z'),
    }).nom,
    periode: Collecte.create({
      id: UUID,
      nom: 'Collecte nationale 2026',
      dateDebut: new Date('2026-03-06T00:00:00.000Z'),
      dateFin: new Date('2026-03-08T00:00:00.000Z'),
      dateFinSaisie: new Date('2026-03-15T00:00:00.000Z'),
    }).periode,
    statut,
    participations: [],
    createdAt: new Date('2026-01-01T09:00:00.000Z'),
    updatedAt: new Date('2026-01-01T09:00:00.000Z'),
  });
}

describe('OuvrirInscriptionsUseCase', () => {
  let useCase: OuvrirInscriptionsUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new OuvrirInscriptionsUseCase(mockRepo);
  });

  it('ouvre les inscriptions d\'une collecte en PREPARATION', async () => {
    const collecte = creerCollecte();
    mockRepo.findById.mockResolvedValue(collecte);
    mockRepo.save.mockResolvedValue(undefined);

    await useCase.execute(UUID);

    expect(collecte.statut).toBe(StatutCollecte.INSCRIPTIONS_OUVERTES);
    expect(mockRepo.save).toHaveBeenCalledWith(collecte);
  });

  it('lève DomainNotFoundException si la collecte est introuvable', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(UUID)).rejects.toThrow(DomainNotFoundException);

    const error = await useCase.execute(UUID).catch(e => e);
    expect(error.message).toBe(`Collecte ${UUID} introuvable`);
    expect(error.code).toBe('COLLECTE_NOT_FOUND');
    expect(mockRepo.save).not.toHaveBeenCalled();
  });

  it('lève DomainValidationException si le statut est invalide', async () => {
    const collecte = creerCollecte(StatutCollecte.INSCRIPTIONS_OUVERTES);
    mockRepo.findById.mockResolvedValue(collecte);

    await expect(useCase.execute(UUID)).rejects.toThrow(DomainValidationException);

    const error = await useCase.execute(UUID).catch(e => e);
    expect(error.message).toBe('Les inscriptions ne peuvent être ouvertes que depuis le statut PREPARATION');
    expect(error.code).toBe('COLLECTE_STATUT_INVALIDE');
    expect(mockRepo.save).not.toHaveBeenCalled();
  });
});
