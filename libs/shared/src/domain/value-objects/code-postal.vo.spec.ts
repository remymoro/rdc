import { CodePostal, DomainValidationException, expectDomainCode } from '@rdc/shared';

describe('CodePostal', () => {
  describe('create', () => {
    it('accepte un code postal valide à 5 chiffres', () => {
      expect(CodePostal.create('33000').value).toBe('33000');
      expect(CodePostal.create('75001').value).toBe('75001');
      expect(CodePostal.create('01000').value).toBe('01000');
    });

    it('rejette un code postal vide', () => {
      expect(() => CodePostal.create('')).toThrow(DomainValidationException);
      expectDomainCode(() => CodePostal.create(''), 'CODE_POSTAL_INVALID');
    });

    it('rejette moins de 5 chiffres', () => {
      expect(() => CodePostal.create('3300')).toThrow(DomainValidationException);
    });

    it('rejette plus de 5 chiffres', () => {
      expect(() => CodePostal.create('330001')).toThrow(DomainValidationException);
    });

    it('rejette des lettres', () => {
      expect(() => CodePostal.create('3300A')).toThrow(DomainValidationException);
    });

    it('rejette des espaces', () => {
      expect(() => CodePostal.create('33 000')).toThrow(DomainValidationException);
    });
  });

  describe('equals', () => {
    it('retourne true pour deux codes postaux identiques', () => {
      expect(CodePostal.create('33000').equals(CodePostal.create('33000'))).toBe(true);
    });

    it('retourne false pour deux codes postaux différents', () => {
      expect(CodePostal.create('33000').equals(CodePostal.create('75001'))).toBe(false);
    });
  });
});
