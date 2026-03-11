import { Telephone, DomainValidationException, expectDomainCode } from '@rdc/shared';

describe('Telephone', () => {
  describe('normalisation vers E.164', () => {
    it('normalise 06 12 34 56 78', () => {
      expect(Telephone.create('06 12 34 56 78').value).toBe('+33612345678');
    });

    it('normalise 0612345678 (sans espaces)', () => {
      expect(Telephone.create('0612345678').value).toBe('+33612345678');
    });

    it('normalise +33 6 12 34 56 78', () => {
      expect(Telephone.create('+33 6 12 34 56 78').value).toBe('+33612345678');
    });

    it('accepte déjà en format +33', () => {
      expect(Telephone.create('+33612345678').value).toBe('+33612345678');
    });

    it('normalise un fixe 01 44 55 66 77', () => {
      expect(Telephone.create('01 44 55 66 77').value).toBe('+33144556677');
    });

    it('normalise un fixe avec tirets 01-44-55-66-77', () => {
      expect(Telephone.create('01-44-55-66-77').value).toBe('+33144556677');
    });

    it('normalise 07 12 34 56 78 (mobile)', () => {
      expect(Telephone.create('07 12 34 56 78').value).toBe('+33712345678');
    });

    it('normalise 09 12 34 56 78', () => {
      expect(Telephone.create('09 12 34 56 78').value).toBe('+33912345678');
    });
  });

  describe('validation', () => {
    it('rejette un numéro vide', () => {
      expect(() => Telephone.create('')).toThrow(DomainValidationException);
      expectDomainCode(() => Telephone.create(''), 'TELEPHONE_EMPTY');
    });

    it('rejette le préfixe 08 (non géré)', () => {
      expect(() => Telephone.create('08 12 34 56 78')).toThrow(DomainValidationException);
      expectDomainCode(() => Telephone.create('08 12 34 56 78'), 'TELEPHONE_INVALID');
    });

    it('rejette un numéro trop court', () => {
      expect(() => Telephone.create('0612345')).toThrow(DomainValidationException);
    });

    it('rejette un numéro trop long', () => {
      expect(() => Telephone.create('061234567890')).toThrow(DomainValidationException);
    });

    it('rejette une chaîne sans préfixe reconnu', () => {
      expect(() => Telephone.create('1234567890')).toThrow(DomainValidationException);
    });
  });

  describe('equals', () => {
    it('retourne true pour deux numéros normalisés identiques', () => {
      expect(
        Telephone.create('06 12 34 56 78').equals(Telephone.create('0612345678'))
      ).toBe(true);
    });

    it('retourne false pour deux numéros différents', () => {
      expect(
        Telephone.create('0612345678').equals(Telephone.create('0712345678'))
      ).toBe(false);
    });
  });
});
