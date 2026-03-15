import { CollecteId } from './collecte-id.vo';
import { DomainValidationException } from '../exceptions/domain-validation.exception';

const UUID_VALIDE = '550e8400-e29b-41d4-a716-446655440000';
const AUTRE_UUID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

function capturerErreur(fn: () => void): DomainValidationException {
  try {
    fn();
  } catch (error) {
    return error as DomainValidationException;
  }

  throw new Error('Une DomainValidationException était attendue');
}

describe('CollecteId', () => {
  describe('create()', () => {
    it('crée un CollecteId avec un UUID valide', () => {
      const id = CollecteId.create(UUID_VALIDE);

      expect(id.value).toBe(UUID_VALIDE);
    });

    it('rejette une valeur vide', () => {
      expect(() => CollecteId.create('')).toThrow(DomainValidationException);

      const error = capturerErreur(() => CollecteId.create(''));
      expect(error.message).toBe('CollecteId ne peut pas être vide');
      expect(error.code).toBe('COLLECTE_ID_EMPTY');
    });

    it('rejette une valeur non UUID', () => {
      expect(() => CollecteId.create('abc')).toThrow(DomainValidationException);

      const error = capturerErreur(() => CollecteId.create('abc'));
      expect(error.message).toBe('CollecteId doit être un UUID valide');
      expect(error.code).toBe('COLLECTE_ID_INVALID');
    });
  });

  describe('equals()', () => {
    it('retourne true pour deux CollecteId avec la même valeur', () => {
      const a = CollecteId.create(UUID_VALIDE);
      const b = CollecteId.create(UUID_VALIDE);

      expect(a.equals(b)).toBe(true);
    });

    it('retourne false pour deux CollecteId différents', () => {
      const a = CollecteId.create(UUID_VALIDE);
      const b = CollecteId.create(AUTRE_UUID);

      expect(a.equals(b)).toBe(false);
    });
  });
});
