import { Email } from './email.vo';
import { DomainValidationException } from '../exceptions/domain-validation.exception';
import { expectDomainCode } from '../../test-utils';

describe('Email', () => {
  describe('normalisation', () => {
    it('met en minuscule', () => {
      expect(Email.create('Contact@Centre.FR').value).toBe('contact@centre.fr');
    });

    it('applique trim()', () => {
      expect(Email.create('  contact@centre.fr  ').value).toBe('contact@centre.fr');
    });

    it('accepte un email simple valide', () => {
      expect(Email.create('contact@example.com').value).toBe('contact@example.com');
    });
  });

  describe('validation', () => {
    it('rejette un email vide', () => {
      expect(() => Email.create('')).toThrow(DomainValidationException);
      expectDomainCode(() => Email.create(''), 'EMAIL_EMPTY');
    });

    it('rejette un email sans @', () => {
      expect(() => Email.create('contactexample.com')).toThrow(DomainValidationException);
      expectDomainCode(() => Email.create('contactexample.com'), 'EMAIL_INVALID');
    });

    it('rejette un email sans domaine', () => {
      expect(() => Email.create('contact@')).toThrow(DomainValidationException);
    });

    it('rejette un email sans extension', () => {
      expect(() => Email.create('contact@example')).toThrow(DomainValidationException);
    });

    it('rejette un email avec espace', () => {
      expect(() => Email.create('con tact@example.com')).toThrow(DomainValidationException);
    });
  });

  describe('equals', () => {
    it('retourne true pour deux emails identiques (après normalisation)', () => {
      expect(Email.create('Contact@Centre.FR').equals(Email.create('contact@centre.fr'))).toBe(true);
    });

    it('retourne false pour deux emails différents', () => {
      expect(Email.create('a@a.fr').equals(Email.create('b@b.fr'))).toBe(false);
    });
  });
});
