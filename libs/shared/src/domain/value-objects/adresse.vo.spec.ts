import { Adresse, DomainValidationException, expectDomainCode } from '@rdc/shared';

describe('Adresse', () => {
  describe('create', () => {
    it('accepte une adresse valide', () => {
      expect(Adresse.create('12 rue de la Paix').value).toBe('12 rue de la Paix');
    });

    it('applique trim()', () => {
      expect(Adresse.create('  12 rue de la Paix  ').value).toBe('12 rue de la Paix');
    });

    it('normalise les espaces multiples', () => {
      expect(Adresse.create('12  rue  de  la  Paix').value).toBe('12 rue de la Paix');
    });

    it('accepte exactement 255 caractères', () => {
      expect(() => Adresse.create('a'.repeat(255))).not.toThrow();
    });

    it('rejette une chaîne vide', () => {
      expect(() => Adresse.create('')).toThrow(DomainValidationException);
      expectDomainCode(() => Adresse.create(''), 'ADRESSE_EMPTY');
    });

    it('rejette une chaîne de spaces uniquement', () => {
      expect(() => Adresse.create('   ')).toThrow(DomainValidationException);
    });

    it('rejette plus de 255 caractères', () => {
      expect(() => Adresse.create('a'.repeat(256))).toThrow(DomainValidationException);
      expectDomainCode(() => Adresse.create('a'.repeat(256)), 'ADRESSE_TOO_LONG');
    });
  });

  describe('equals', () => {
    it('retourne true pour deux adresses identiques', () => {
      expect(Adresse.create('12 rue de la Paix').equals(Adresse.create('12 rue de la Paix'))).toBe(true);
    });

    it('retourne false pour deux adresses différentes', () => {
      expect(Adresse.create('12 rue de la Paix').equals(Adresse.create('5 avenue Foch'))).toBe(false);
    });
  });
});
