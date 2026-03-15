import {
  Collecte,
  DomainNotFoundException,
  DomainValidationException,
  type ICollecteRepository,
  type IMagasinRepository,
  Magasin,
  StatutCollecte,
} from '@rdc/domain';
import { AjouterMagasinCollecteUseCase } from './ajouter-magasin-collecte.usecase';

const UUID_COLLECTE = '550e8400-e29b-41d4-a716-446655440000';
const UUID_MAGASIN = '11111111-1111-4111-8111-111111111111';

const mockCollecteRepo: jest.Mocked<ICollecteRepository> = {
  findById: jest.fn(),
  findAll: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

const mockMagasinRepo: jest.Mocked<IMagasinRepository> = {
  findById: jest.fn(),
  findAll: jest.fn(),
  findByCentreId: jest.fn(),
  findByUniqueKey: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  saveImage: jest.fn(),
  deleteImage: jest.fn(),
};

function creerCollecte(statut = StatutCollecte.PREPARATION): Collecte {
  const collecte = Collecte.create({
    id: UUID_COLLECTE,
    nom: 'Collecte nationale 2026',
    dateDebut: new Date('2026-03-06T00:00:00.000Z'),
    dateFin: new Date('2026-03-08T00:00:00.000Z'),
    dateFinSaisie: new Date('2026-03-15T00:00:00.000Z'),
  });

  if (statut === StatutCollecte.INSCRIPTIONS_OUVERTES) {
    collecte.ouvrirInscriptions();
  }

  return collecte;
}

function creerMagasin(statut: 'ACTIF' | 'INACTIF' | 'ARCHIVE' = 'ACTIF'): Magasin {
  const magasin = Magasin.create({
    id: UUID_MAGASIN,
    nom: 'Magasin de Lille',
    ville: 'Lille',
    codePostal: '59000',
    adresse: '10 rue de la Gare',
    centreId: '33333333-3333-4333-8333-333333333333',
  });

  if (statut === 'INACTIF') {
    magasin.desactiver();
  }

  if (statut === 'ARCHIVE') {
    magasin.archiver();
  }

  return magasin;
}

describe('AjouterMagasinCollecteUseCase', () => {
  let useCase: AjouterMagasinCollecteUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new AjouterMagasinCollecteUseCase(mockCollecteRepo, mockMagasinRepo);
  });

  it('ajoute un magasin ACTIF à une collecte en PREPARATION', async () => {
    const collecte = creerCollecte();
    const magasin = creerMagasin();
    mockCollecteRepo.findById.mockResolvedValue(collecte);
    mockMagasinRepo.findById.mockResolvedValue(magasin);
    mockCollecteRepo.save.mockResolvedValue(undefined);

    await useCase.execute({ collecteId: UUID_COLLECTE, magasinId: UUID_MAGASIN });

    expect(collecte.participations).toHaveLength(1);
    expect(collecte.participations[0].magasinId.value).toBe(UUID_MAGASIN);
    expect(mockCollecteRepo.save).toHaveBeenCalledWith(collecte);
  });

  it('lève DomainNotFoundException si la collecte est introuvable', async () => {
    mockCollecteRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute({ collecteId: UUID_COLLECTE, magasinId: UUID_MAGASIN }))
      .rejects.toThrow(DomainNotFoundException);

    const error = await useCase.execute({ collecteId: UUID_COLLECTE, magasinId: UUID_MAGASIN }).catch(e => e);
    expect(error.message).toBe(`Collecte ${UUID_COLLECTE} introuvable`);
    expect(error.code).toBe('COLLECTE_NOT_FOUND');
  });

  it('lève DomainNotFoundException si le magasin est introuvable', async () => {
    mockCollecteRepo.findById.mockResolvedValue(creerCollecte());
    mockMagasinRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute({ collecteId: UUID_COLLECTE, magasinId: UUID_MAGASIN }))
      .rejects.toThrow(DomainNotFoundException);

    const error = await useCase.execute({ collecteId: UUID_COLLECTE, magasinId: UUID_MAGASIN }).catch(e => e);
    expect(error.message).toBe(`Magasin ${UUID_MAGASIN} introuvable`);
    expect(error.code).toBe('MAGASIN_NOT_FOUND');
  });

  it('lève DomainValidationException si le magasin est INACTIF', async () => {
    mockCollecteRepo.findById.mockResolvedValue(creerCollecte());
    mockMagasinRepo.findById.mockResolvedValue(creerMagasin('INACTIF'));

    await expect(useCase.execute({ collecteId: UUID_COLLECTE, magasinId: UUID_MAGASIN }))
      .rejects.toThrow(DomainValidationException);

    const error = await useCase.execute({ collecteId: UUID_COLLECTE, magasinId: UUID_MAGASIN }).catch(e => e);
    expect(error.message).toBe('Seuls les magasins actifs peuvent participer à une collecte');
    expect(error.code).toBe('MAGASIN_INACTIF');
    expect(mockCollecteRepo.save).not.toHaveBeenCalled();
  });

  it('lève DomainValidationException si le magasin est ARCHIVE', async () => {
    mockCollecteRepo.findById.mockResolvedValue(creerCollecte());
    mockMagasinRepo.findById.mockResolvedValue(creerMagasin('ARCHIVE'));

    await expect(useCase.execute({ collecteId: UUID_COLLECTE, magasinId: UUID_MAGASIN }))
      .rejects.toThrow(DomainValidationException);

    const error = await useCase.execute({ collecteId: UUID_COLLECTE, magasinId: UUID_MAGASIN }).catch(e => e);
    expect(error.message).toBe('Seuls les magasins actifs peuvent participer à une collecte');
    expect(error.code).toBe('MAGASIN_INACTIF');
    expect(mockCollecteRepo.save).not.toHaveBeenCalled();
  });

  it('lève DomainValidationException si la collecte n\'est pas en PREPARATION', async () => {
    mockCollecteRepo.findById.mockResolvedValue(creerCollecte(StatutCollecte.INSCRIPTIONS_OUVERTES));
    mockMagasinRepo.findById.mockResolvedValue(creerMagasin());

    await expect(useCase.execute({ collecteId: UUID_COLLECTE, magasinId: UUID_MAGASIN }))
      .rejects.toThrow(DomainValidationException);

    const error = await useCase.execute({ collecteId: UUID_COLLECTE, magasinId: UUID_MAGASIN }).catch(e => e);
    expect(error.message).toBe('Les magasins ne peuvent être ajoutés qu\'en phase de PREPARATION');
    expect(error.code).toBe('COLLECTE_STATUT_INVALIDE');
    expect(mockCollecteRepo.save).not.toHaveBeenCalled();
  });
});
