import { PeriodeCollecte } from './periode-collecte.vo';
import { DomainValidationException } from '../exceptions/domain-validation.exception';

const DATE_DEBUT = new Date('2026-10-01T00:00:00.000Z');
const DATE_FIN = new Date('2026-10-05T00:00:00.000Z');
const DATE_FIN_SAISIE = new Date('2026-10-10T00:00:00.000Z');

function capturerErreur(fn: () => void): DomainValidationException {
  try {
    fn();
  } catch (error) {
    return error as DomainValidationException;
  }

  throw new Error('Une DomainValidationException était attendue');
}

describe('PeriodeCollecte', () => {
  describe('create()', () => {
    it('crée une période valide quand dateDebut < dateFin < dateFinSaisie', () => {
      const periode = PeriodeCollecte.create(DATE_DEBUT, DATE_FIN, DATE_FIN_SAISIE);

      expect(periode.dateDebut).toEqual(DATE_DEBUT);
      expect(periode.dateFin).toEqual(DATE_FIN);
      expect(periode.dateFinSaisie).toEqual(DATE_FIN_SAISIE);
    });

    it('rejette si dateFin est inférieure ou égale à dateDebut', () => {
      expect(() => PeriodeCollecte.create(DATE_DEBUT, DATE_DEBUT, DATE_FIN_SAISIE))
        .toThrow(DomainValidationException);

      const error = capturerErreur(() =>
        PeriodeCollecte.create(DATE_DEBUT, DATE_DEBUT, DATE_FIN_SAISIE)
      );
      expect(error.message).toBe('La date de fin doit être postérieure à la date de début');
      expect(error.code).toBe('PERIODE_DATE_FIN_INVALIDE');
    });

    it('rejette si dateFinSaisie est inférieure ou égale à dateFin', () => {
      expect(() => PeriodeCollecte.create(DATE_DEBUT, DATE_FIN, DATE_FIN))
        .toThrow(DomainValidationException);

      const error = capturerErreur(() =>
        PeriodeCollecte.create(DATE_DEBUT, DATE_FIN, DATE_FIN)
      );
      expect(error.message).toBe('La date de fin de saisie doit être postérieure à la fin de la collecte');
      expect(error.code).toBe('PERIODE_DATE_FIN_SAISIE_INVALIDE');
    });

    it('rejette si la date de début est invalide', () => {
      expect(() => PeriodeCollecte.create(new Date('invalide'), DATE_FIN, DATE_FIN_SAISIE))
        .toThrow(DomainValidationException);

      const error = capturerErreur(() =>
        PeriodeCollecte.create(new Date('invalide'), DATE_FIN, DATE_FIN_SAISIE)
      );
      expect(error.message).toBe('La date de début est invalide');
      expect(error.code).toBe('PERIODE_DATE_DEBUT_INVALIDE');
    });

    it('rejette si la date de fin est invalide', () => {
      expect(() => PeriodeCollecte.create(DATE_DEBUT, new Date('invalide'), DATE_FIN_SAISIE))
        .toThrow(DomainValidationException);

      const error = capturerErreur(() =>
        PeriodeCollecte.create(DATE_DEBUT, new Date('invalide'), DATE_FIN_SAISIE)
      );
      expect(error.message).toBe('La date de fin est invalide');
      expect(error.code).toBe('PERIODE_DATE_FIN_INVALIDE');
    });

    it('rejette si la date de fin de saisie est invalide', () => {
      expect(() => PeriodeCollecte.create(DATE_DEBUT, DATE_FIN, new Date('invalide')))
        .toThrow(DomainValidationException);

      const error = capturerErreur(() =>
        PeriodeCollecte.create(DATE_DEBUT, DATE_FIN, new Date('invalide'))
      );
      expect(error.message).toBe('La date de fin de saisie est invalide');
      expect(error.code).toBe('PERIODE_DATE_FIN_SAISIE_INVALIDE');
    });
  });

  describe('annee', () => {
    it("retourne l'année de dateDebut", () => {
      const periode = PeriodeCollecte.create(DATE_DEBUT, DATE_FIN, DATE_FIN_SAISIE);

      expect(periode.annee).toBe(2026);
    });
  });

  describe('dureeEnJours', () => {
    it('calcule correctement la durée en jours', () => {
      const periode = PeriodeCollecte.create(DATE_DEBUT, DATE_FIN, DATE_FIN_SAISIE);

      expect(periode.dureeEnJours).toBe(4);
    });
  });

  describe('estEnToleranceDeSaisie()', () => {
    it('retourne true si now est entre dateFin et dateFinSaisie', () => {
      const periode = PeriodeCollecte.create(DATE_DEBUT, DATE_FIN, DATE_FIN_SAISIE);

      expect(periode.estEnToleranceDeSaisie(new Date('2026-10-07T00:00:00.000Z'))).toBe(true);
    });

    it('retourne false si now est hors de la période de tolérance', () => {
      const periode = PeriodeCollecte.create(DATE_DEBUT, DATE_FIN, DATE_FIN_SAISIE);

      expect(periode.estEnToleranceDeSaisie(new Date('2026-10-03T00:00:00.000Z'))).toBe(false);
      expect(periode.estEnToleranceDeSaisie(new Date('2026-10-15T00:00:00.000Z'))).toBe(false);
    });
  });

  describe('equals()', () => {
    it('retourne true pour deux périodes identiques', () => {
      const a = PeriodeCollecte.create(DATE_DEBUT, DATE_FIN, DATE_FIN_SAISIE);
      const b = PeriodeCollecte.create(new Date(DATE_DEBUT), new Date(DATE_FIN), new Date(DATE_FIN_SAISIE));

      expect(a.equals(b)).toBe(true);
    });

    it('retourne false pour deux périodes différentes', () => {
      const a = PeriodeCollecte.create(DATE_DEBUT, DATE_FIN, DATE_FIN_SAISIE);
      const b = PeriodeCollecte.create(
        new Date('2026-11-01T00:00:00.000Z'),
        new Date('2026-11-05T00:00:00.000Z'),
        new Date('2026-11-10T00:00:00.000Z'),
      );

      expect(a.equals(b)).toBe(false);
    });
  });
});
