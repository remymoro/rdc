import {
  Collecte,
  DomainNotFoundException,
  DomainValidationException,
  type ICollecteRepository,
  MagasinId,
  StatutCollecte,
} from '@rdc/domain';
import { RetirerMagasinCollecteUseCase } from './retirer-magasin-collecte.usecase';

const UUID_COLLECTE = '550e8400-e29b-41d4-a716-446655440000';
const UUID_MAGASIN = '11111111-1111-4111-8111-111111111111';
const UUID_MAGASIN_2 = '22222222-2222-4222-8222-222222222222';

const mockRepo: jest.Mocked<ICollecteRepository> = {
  findById: jest.fn(),
  findAll: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

function creerCollecteAvecMagasin(statut = StatutCollecte.PREPARATION): Collecte {
  const collecte = Collecte.create({
    id: UUID_COLLECTE,
    nom: 'Collecte nationale 2026',
    dateDebut: new Date('2026-03-06T00:00:00.000Z'),
    dateFin: new Date('2026-03-08T00:00:00.000Z'),
    dateFinSaisie: new Date('2026-03-15T00:00:00.000Z'),
  });

  collecte.ajouterMagasin(MagasinId.create(UUID_MAGASIN));
  collecte.ajouterMagasin(MagasinId.create(UUID_MAGASIN_2));

  if (statut === StatutCollecte.INSCRIPTIONS_OUVERTES) {
    collecte.ouvrirInscriptions();
  }

  return collecte;
}

describe('RetirerMagasinCollecteUseCase', () => {
  let useCase: RetirerMagasinCollecteUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RetirerMagasinCollecteUseCase(mockRepo);
  });

  it('retire un magasin d\'une collecte en PREPARATION', async () => {
    const collecte = creerCollecteAvecMagasin();
    mockRepo.findById.mockResolvedValue(collecte);
    mockRepo.save.mockResolvedValue(undefined);

    await useCase.execute({ collecteId: UUID_COLLECTE, magasinId: UUID_MAGASIN });

    expect(collecte.participations).toHaveLength(1);
    expect(collecte.participations[0].magasinId.value).toBe(UUID_MAGASIN_2);
    expect(mockRepo.save).toHaveBeenCalledWith(collecte);
  });

  it('lève DomainNotFoundException si la collecte est introuvable', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute({ collecteId: UUID_COLLECTE, magasinId: UUID_MAGASIN }))
      .rejects.toThrow(DomainNotFoundException);

    const error = await useCase.execute({ collecteId: UUID_COLLECTE, magasinId: UUID_MAGASIN }).catch(e => e);
    expect(error.message).toBe(`Collecte ${UUID_COLLECTE} introuvable`);
    expect(error.code).toBe('COLLECTE_NOT_FOUND');
  });

  it('lève DomainValidationException si la collecte n\'est pas en PREPARATION', async () => {
    mockRepo.findById.mockResolvedValue(
      creerCollecteAvecMagasin(StatutCollecte.INSCRIPTIONS_OUVERTES),
    );

    await expect(useCase.execute({ collecteId: UUID_COLLECTE, magasinId: UUID_MAGASIN }))
      .rejects.toThrow(DomainValidationException);

    const error = await useCase.execute({ collecteId: UUID_COLLECTE, magasinId: UUID_MAGASIN }).catch(e => e);
    expect(error.message).toBe('Un magasin ne peut être retiré qu\'en phase de PREPARATION');
    expect(error.code).toBe('COLLECTE_STATUT_INVALIDE');
    expect(mockRepo.save).not.toHaveBeenCalled();
  });
});
