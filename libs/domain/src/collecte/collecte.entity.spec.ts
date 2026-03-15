import {
  Collecte,
  type CollecteProps,
  StatutCollecte,
  StatutParticipation,
} from './collecte.entity';
import { CollecteId } from '../value-objects/collecte-id.vo';
import { MagasinId } from '../value-objects/magasin-id.vo';
import { Nom } from '../value-objects/nom.vo';
import { PeriodeCollecte } from '../value-objects/periode-collecte.vo';
import { DomainValidationException } from '../exceptions/domain-validation.exception';

const UUID_COLLECTE = '550e8400-e29b-41d4-a716-446655440000';
const UUID_MAGASIN_1 = '11111111-1111-4111-8111-111111111111';
const UUID_MAGASIN_2 = '22222222-2222-4222-8222-222222222222';
const DATE_DEBUT = new Date('2026-03-06T00:00:00.000Z');
const DATE_FIN = new Date('2026-03-08T00:00:00.000Z');
const DATE_FIN_SAISIE = new Date('2026-03-15T00:00:00.000Z');

function creerCollecte(): Collecte {
  return Collecte.create({
    id: UUID_COLLECTE,
    nom: 'Collecte nationale 2026',
    dateDebut: DATE_DEBUT,
    dateFin: DATE_FIN,
    dateFinSaisie: DATE_FIN_SAISIE,
  });
}

function participation(
  magasinId: string,
  statut = StatutParticipation.CONFIRME,
) {
  return {
    magasinId: MagasinId.create(magasinId),
    statut,
  };
}

function creerProps(overrides: Partial<CollecteProps> = {}): CollecteProps {
  return {
    id: CollecteId.create(UUID_COLLECTE),
    nom: Nom.create('Collecte nationale 2026'),
    periode: PeriodeCollecte.create(DATE_DEBUT, DATE_FIN, DATE_FIN_SAISIE),
    statut: StatutCollecte.PREPARATION,
    participations: [],
    createdAt: new Date('2026-01-01T09:00:00.000Z'),
    updatedAt: new Date('2026-01-01T09:00:00.000Z'),
    ...overrides,
  };
}

function capturerErreur(fn: () => void): DomainValidationException {
  try {
    fn();
  } catch (error) {
    return error as DomainValidationException;
  }

  throw new Error('Une DomainValidationException était attendue');
}

describe('Collecte', () => {
  describe('create()', () => {
    it('initialise une collecte en PREPARATION avec des participations vides', () => {
      const collecte = creerCollecte();

      expect(collecte.statut).toBe(StatutCollecte.PREPARATION);
      expect(collecte.participations).toEqual([]);
    });
  });

  describe('reconstituer()', () => {
    it("restaure l'état d'une collecte existante", () => {
      const props = creerProps({
        statut: StatutCollecte.INSCRIPTIONS_FERMEES,
        participations: [participation(UUID_MAGASIN_1, StatutParticipation.REFUSE)],
      });

      const collecte = Collecte.reconstituer(props);

      expect(collecte.id.value).toBe(UUID_COLLECTE);
      expect(collecte.nom.value).toBe('Collecte nationale 2026');
      expect(collecte.statut).toBe(StatutCollecte.INSCRIPTIONS_FERMEES);
      expect(collecte.participations).toHaveLength(1);
      expect(collecte.participations[0].statut).toBe(StatutParticipation.REFUSE);
      expect(collecte.createdAt).toEqual(props.createdAt);
      expect(collecte.updatedAt).toEqual(props.updatedAt);
    });
  });

  describe('ouvrirInscriptions()', () => {
    it('passe de PREPARATION à INSCRIPTIONS_OUVERTES', () => {
      const collecte = creerCollecte();

      collecte.ouvrirInscriptions();

      expect(collecte.statut).toBe(StatutCollecte.INSCRIPTIONS_OUVERTES);
    });

    it('lève une exception si le statut ne permet pas la transition', () => {
      const collecte = Collecte.reconstituer(
        creerProps({ statut: StatutCollecte.INSCRIPTIONS_OUVERTES }),
      );

      const error = capturerErreur(() => collecte.ouvrirInscriptions());
      expect(error.message).toBe('Les inscriptions ne peuvent être ouvertes que depuis le statut PREPARATION');
      expect(error.code).toBe('COLLECTE_STATUT_INVALIDE');
    });
  });

  describe('fermerInscriptions()', () => {
    it('passe de INSCRIPTIONS_OUVERTES à INSCRIPTIONS_FERMEES', () => {
      const collecte = creerCollecte();
      collecte.ouvrirInscriptions();

      collecte.fermerInscriptions();

      expect(collecte.statut).toBe(StatutCollecte.INSCRIPTIONS_FERMEES);
    });

    it('lève une exception si le statut ne permet pas la transition', () => {
      const collecte = creerCollecte();

      const error = capturerErreur(() => collecte.fermerInscriptions());
      expect(error.message).toBe('Les inscriptions ne peuvent être fermées que depuis le statut INSCRIPTIONS_OUVERTES');
      expect(error.code).toBe('COLLECTE_STATUT_INVALIDE');
    });
  });

  describe('demarrer()', () => {
    it('passe de INSCRIPTIONS_FERMEES à EN_COURS', () => {
      const collecte = creerCollecte();
      collecte.ouvrirInscriptions();
      collecte.fermerInscriptions();

      collecte.demarrer();

      expect(collecte.statut).toBe(StatutCollecte.EN_COURS);
    });

    it('lève une exception si le statut ne permet pas la transition', () => {
      const collecte = creerCollecte();

      const error = capturerErreur(() => collecte.demarrer());
      expect(error.message).toBe('La collecte ne peut démarrer que depuis le statut INSCRIPTIONS_FERMEES');
      expect(error.code).toBe('COLLECTE_STATUT_INVALIDE');
    });
  });

  describe('ouvrirSaisie()', () => {
    it('passe de EN_COURS à SAISIE_EN_COURS', () => {
      const collecte = creerCollecte();
      collecte.ouvrirInscriptions();
      collecte.fermerInscriptions();
      collecte.demarrer();

      collecte.ouvrirSaisie();

      expect(collecte.statut).toBe(StatutCollecte.SAISIE_EN_COURS);
    });

    it('lève une exception si le statut ne permet pas la transition', () => {
      const collecte = creerCollecte();

      const error = capturerErreur(() => collecte.ouvrirSaisie());
      expect(error.message).toBe('La saisie ne peut être ouverte que depuis le statut EN_COURS');
      expect(error.code).toBe('COLLECTE_STATUT_INVALIDE');
    });
  });

  describe('terminer()', () => {
    it('passe de SAISIE_EN_COURS à TERMINEE', () => {
      const collecte = creerCollecte();
      collecte.ouvrirInscriptions();
      collecte.fermerInscriptions();
      collecte.demarrer();
      collecte.ouvrirSaisie();

      collecte.terminer();

      expect(collecte.statut).toBe(StatutCollecte.TERMINEE);
    });

    it('lève une exception si le statut ne permet pas la transition', () => {
      const collecte = creerCollecte();

      const error = capturerErreur(() => collecte.terminer());
      expect(error.message).toBe('La collecte ne peut être terminée que depuis le statut SAISIE_EN_COURS');
      expect(error.code).toBe('COLLECTE_STATUT_INVALIDE');
    });
  });

  describe('ajouterMagasin()', () => {
    it('ajoute un magasin en CONFIRME', () => {
      const collecte = creerCollecte();

      collecte.ajouterMagasin(MagasinId.create(UUID_MAGASIN_1));

      expect(collecte.participations).toHaveLength(1);
      expect(collecte.participations[0]).toEqual({
        magasinId: MagasinId.create(UUID_MAGASIN_1),
        statut: StatutParticipation.CONFIRME,
      });
    });

    it('est idempotent si le magasin est déjà présent', () => {
      const collecte = creerCollecte();
      const magasinId = MagasinId.create(UUID_MAGASIN_1);

      collecte.ajouterMagasin(magasinId);
      collecte.ajouterMagasin(magasinId);

      expect(collecte.participations).toHaveLength(1);
    });

    it('lève une exception si la collecte n\'est pas en PREPARATION', () => {
      const collecte = Collecte.reconstituer(
        creerProps({ statut: StatutCollecte.INSCRIPTIONS_OUVERTES }),
      );

      const error = capturerErreur(() => collecte.ajouterMagasin(MagasinId.create(UUID_MAGASIN_1)));
      expect(error.message).toBe('Les magasins ne peuvent être ajoutés qu\'en phase de PREPARATION');
      expect(error.code).toBe('COLLECTE_STATUT_INVALIDE');
    });
  });

  describe('retirerMagasin()', () => {
    it('retire un magasin existant', () => {
      const collecte = Collecte.reconstituer(
        creerProps({
          participations: [
            participation(UUID_MAGASIN_1),
            participation(UUID_MAGASIN_2),
          ],
        }),
      );

      collecte.retirerMagasin(MagasinId.create(UUID_MAGASIN_1));

      expect(collecte.participations).toHaveLength(1);
      expect(collecte.participations[0].magasinId.value).toBe(UUID_MAGASIN_2);
    });

    it('lève une exception si la collecte n\'est pas en PREPARATION', () => {
      const collecte = Collecte.reconstituer(
        creerProps({
          statut: StatutCollecte.INSCRIPTIONS_OUVERTES,
          participations: [participation(UUID_MAGASIN_1)],
        }),
      );

      const error = capturerErreur(() => collecte.retirerMagasin(MagasinId.create(UUID_MAGASIN_1)));
      expect(error.message).toBe('Un magasin ne peut être retiré qu\'en phase de PREPARATION');
      expect(error.code).toBe('COLLECTE_STATUT_INVALIDE');
    });

    it('lève une exception si le magasin est absent', () => {
      const collecte = creerCollecte();

      const error = capturerErreur(() => collecte.retirerMagasin(MagasinId.create(UUID_MAGASIN_1)));
      expect(error.message).toBe('Ce magasin ne fait pas partie de la collecte');
      expect(error.code).toBe('MAGASIN_NON_INSCRIT');
    });
  });

  describe('magasinEstConfirme()', () => {
    it('retourne true si le magasin participe avec le statut CONFIRME', () => {
      const collecte = Collecte.reconstituer(
        creerProps({ participations: [participation(UUID_MAGASIN_1)] }),
      );

      expect(collecte.magasinEstConfirme(MagasinId.create(UUID_MAGASIN_1))).toBe(true);
    });

    it('retourne false sinon', () => {
      const collecte = Collecte.reconstituer(
        creerProps({
          participations: [participation(UUID_MAGASIN_1, StatutParticipation.REFUSE)],
        }),
      );

      expect(collecte.magasinEstConfirme(MagasinId.create(UUID_MAGASIN_1))).toBe(false);
      expect(collecte.magasinEstConfirme(MagasinId.create(UUID_MAGASIN_2))).toBe(false);
    });
  });

  describe('estOuverteAuxInscriptions()', () => {
    it('retourne true quand la collecte est en INSCRIPTIONS_OUVERTES', () => {
      const collecte = Collecte.reconstituer(
        creerProps({ statut: StatutCollecte.INSCRIPTIONS_OUVERTES }),
      );

      expect(collecte.estOuverteAuxInscriptions()).toBe(true);
    });

    it('retourne false pour les autres statuts', () => {
      expect(creerCollecte().estOuverteAuxInscriptions()).toBe(false);
    });
  });

  describe('estTerminee()', () => {
    it('retourne true quand la collecte est terminée', () => {
      const collecte = Collecte.reconstituer(
        creerProps({ statut: StatutCollecte.TERMINEE }),
      );

      expect(collecte.estTerminee()).toBe(true);
    });

    it('retourne false tant que la collecte n\'est pas terminée', () => {
      expect(creerCollecte().estTerminee()).toBe(false);
    });
  });
});
