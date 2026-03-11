import { Ville } from './ville.vo';
import { DomainValidationException } from '../exceptions/domain-validation.exception';
import { expectDomainCode } from '../../test-utils';

describe('Ville', () => {
  describe('create', () => {
    it('accepte une ville valide', () => {
      expect(Ville.create('Bordeaux').value).toBe('Bordeaux');
    });

    it('applique trim()', () => {
      expect(Ville.create('  Bordeaux  ').value).toBe('Bordeaux');
    });

    it('normalise les espaces multiples', () => {
      expect(Ville.create('Saint  Rémy  de  Provence').value).toBe('Saint Rémy de Provence');
    });

    it('accepte exactement 100 caractères', () => {
      expect(() => Ville.create('a'.repeat(100))).not.toThrow();
    });

    it('rejette une chaîne vide', () => {
      expect(() => Ville.create('')).toThrow(DomainValidationException);
      expectDomainCode(() => Ville.create(''), 'VILLE_EMPTY');
    });

    it('rejette une chaîne de spaces uniquement', () => {
      expect(() => Ville.create('   ')).toThrow(DomainValidationException);
    });

    it('rejette plus de 100 caractères', () => {
      expect(() => Ville.create('a'.repeat(101))).toThrow(DomainValidationException);
      expectDomainCode(() => Ville.create('a'.repeat(101)), 'VILLE_TOO_LONG');
    });
  });

  describe('equals', () => {
    it('retourne true pour deux villes identiques', () => {
      expect(Ville.create('Bordeaux').equals(Ville.create('Bordeaux'))).toBe(true);
    });

    it('retourne false pour deux villes différentes', () => {
      expect(Ville.create('Bordeaux').equals(Ville.create('Paris'))).toBe(false);
    });
  });
});
