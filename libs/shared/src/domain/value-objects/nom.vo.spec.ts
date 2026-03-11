import { Nom, DomainValidationException, expectDomainCode } from '@rdc/shared';

describe('Nom', () => {
  describe('create', () => {
    it('crée un Nom valide', () => {
      expect(Nom.create('Centre Bordeaux').value).toBe('Centre Bordeaux');
    });

    it('applique trim()', () => {
      expect(Nom.create('  Centre Bordeaux  ').value).toBe('Centre Bordeaux');
    });

    it('accepte exactement 100 caractères', () => {
      expect(() => Nom.create('a'.repeat(100))).not.toThrow();
    });

    it('rejette une chaîne vide', () => {
      expect(() => Nom.create('')).toThrow(DomainValidationException);
      expectDomainCode(() => Nom.create(''), 'NOM_EMPTY');
    });

    it('rejette une chaîne de spaces uniquement', () => {
      expect(() => Nom.create('   ')).toThrow(DomainValidationException);
    });

    it('rejette plus de 100 caractères', () => {
      expect(() => Nom.create('a'.repeat(101))).toThrow(DomainValidationException);
      expectDomainCode(() => Nom.create('a'.repeat(101)), 'NOM_TOO_LONG');
    });
  });

  describe('equals', () => {
    it('retourne true pour deux noms identiques', () => {
      expect(Nom.create('Centre A').equals(Nom.create('Centre A'))).toBe(true);
    });

    it('retourne false pour deux noms différents', () => {
      expect(Nom.create('Centre A').equals(Nom.create('Centre B'))).toBe(false);
    });
  });
});
