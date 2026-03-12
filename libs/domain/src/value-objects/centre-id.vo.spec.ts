import { CentreId } from './centre-id.vo';
import { DomainValidationException } from '../exceptions/domain-validation.exception';
import { expectDomainCode } from '../test-utils';

const UUID_VALIDE = '550e8400-e29b-41d4-a716-446655440000';

describe('CentreId', () => {
  describe('create', () => {
    it('accepte un UUID valide', () => {
      expect(CentreId.create(UUID_VALIDE).value).toBe(UUID_VALIDE);
    });

    it('accepte un UUID en majuscules', () => {
      expect(() => CentreId.create(UUID_VALIDE.toUpperCase())).not.toThrow();
    });

    it('rejette une chaîne vide', () => {
      expect(() => CentreId.create('')).toThrow(DomainValidationException);
      expectDomainCode(() => CentreId.create(''), 'CENTRE_ID_EMPTY');
    });

    it('rejette une chaîne non-UUID', () => {
      expect(() => CentreId.create('pas-un-uuid')).toThrow(DomainValidationException);
      expectDomainCode(() => CentreId.create('pas-un-uuid'), 'CENTRE_ID_INVALID');
    });

    it('rejette un UUID malformé', () => {
      expect(() => CentreId.create('550e8400-e29b-41d4-a716')).toThrow(DomainValidationException);
    });
  });

  describe('equals', () => {
    it('retourne true pour deux IDs identiques', () => {
      expect(CentreId.create(UUID_VALIDE).equals(CentreId.create(UUID_VALIDE))).toBe(true);
    });

    it('retourne false pour deux IDs différents', () => {
      const autre = '660e8400-e29b-41d4-a716-446655440000';
      expect(CentreId.create(UUID_VALIDE).equals(CentreId.create(autre))).toBe(false);
    });
  });
});
