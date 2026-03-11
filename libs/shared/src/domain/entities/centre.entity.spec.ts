import { Centre, StatutCentre } from './centre.entity';
import { DomainValidationException } from '../exceptions/domain-validation.exception';
import { expectDomainCode } from '../../test-utils';

const PARAMS_VALIDES = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  nom: 'Centre Bordeaux Sud',
  ville: 'Bordeaux',
  codePostal: '33000',
  adresse: '12 rue de la Paix',
};

describe('Centre', () => {
  describe('create()', () => {
    it('crée un centre avec statut ACTIF par défaut', () => {
      expect(Centre.create(PARAMS_VALIDES).statut).toBe(StatutCentre.ACTIF);
    });

    it('stocke les valeurs normalisées via les VOs', () => {
      const centre = Centre.create({
        ...PARAMS_VALIDES,
        nom: '  Centre Bordeaux  ',
        telephone: '06 12 34 56 78',
        email: 'Contact@Bordeaux.FR',
      });
      expect(centre.nom.value).toBe('Centre Bordeaux');
      expect(centre.telephone?.value).toBe('+33612345678');
      expect(centre.email?.value).toBe('contact@bordeaux.fr');
    });

    it('crée un centre sans téléphone ni email', () => {
      const centre = Centre.create(PARAMS_VALIDES);
      expect(centre.telephone).toBeUndefined();
      expect(centre.email).toBeUndefined();
    });

    it('rejette un id invalide (non UUID)', () => {
      expect(() => Centre.create({ ...PARAMS_VALIDES, id: 'pas-un-uuid' }))
        .toThrow(DomainValidationException);
    });

    it('rejette un nom vide', () => {
      expect(() => Centre.create({ ...PARAMS_VALIDES, nom: '' }))
        .toThrow(DomainValidationException);
    });

    it('rejette un code postal invalide', () => {
      expect(() => Centre.create({ ...PARAMS_VALIDES, codePostal: '3300' }))
        .toThrow(DomainValidationException);
    });

    it('rejette une ville vide', () => {
      expect(() => Centre.create({ ...PARAMS_VALIDES, ville: '' }))
        .toThrow(DomainValidationException);
    });

    it('rejette une adresse vide', () => {
      expect(() => Centre.create({ ...PARAMS_VALIDES, adresse: '' }))
        .toThrow(DomainValidationException);
    });

    it('rejette un email invalide', () => {
      expect(() => Centre.create({ ...PARAMS_VALIDES, email: 'pas-un-email' }))
        .toThrow(DomainValidationException);
    });

    it('rejette un téléphone invalide', () => {
      expect(() => Centre.create({ ...PARAMS_VALIDES, telephone: '08 12 34 56 78' }))
        .toThrow(DomainValidationException);
    });
  });

  describe('estActif()', () => {
    it('retourne true pour un centre ACTIF', () => {
      expect(Centre.create(PARAMS_VALIDES).estActif()).toBe(true);
    });
  });

  describe('desactiver()', () => {
    it('passe de ACTIF à INACTIF', () => {
      const centre = Centre.create(PARAMS_VALIDES);
      centre.desactiver();
      expect(centre.statut).toBe(StatutCentre.INACTIF);
    });

    it('met à jour updatedAt', () => {
      const centre = Centre.create(PARAMS_VALIDES);
      const avant = centre.updatedAt;
      centre.desactiver();
      expect(centre.updatedAt.getTime()).toBeGreaterThanOrEqual(avant.getTime());
    });

    it('lève une exception si le centre est archivé', () => {
      const centre = Centre.create(PARAMS_VALIDES);
      centre.archiver();
      expect(() => centre.desactiver()).toThrow(DomainValidationException);
      expectDomainCode(() => centre.desactiver(), 'CENTRE_ARCHIVED');
    });
  });

  describe('activer()', () => {
    it('passe de INACTIF à ACTIF', () => {
      const centre = Centre.create(PARAMS_VALIDES);
      centre.desactiver();
      centre.activer();
      expect(centre.statut).toBe(StatutCentre.ACTIF);
    });

    it('lève une exception si le centre est archivé', () => {
      const centre = Centre.create(PARAMS_VALIDES);
      centre.archiver();
      expect(() => centre.activer()).toThrow(DomainValidationException);
      expectDomainCode(() => centre.activer(), 'CENTRE_ARCHIVED');
    });
  });

  describe('archiver()', () => {
    it('passe de ACTIF à ARCHIVE', () => {
      const centre = Centre.create(PARAMS_VALIDES);
      centre.archiver();
      expect(centre.statut).toBe(StatutCentre.ARCHIVE);
    });

    it('passe de INACTIF à ARCHIVE', () => {
      const centre = Centre.create(PARAMS_VALIDES);
      centre.desactiver();
      centre.archiver();
      expect(centre.statut).toBe(StatutCentre.ARCHIVE);
    });
  });

  describe('modifier()', () => {
    it('met à jour uniquement les champs fournis', () => {
      const centre = Centre.create(PARAMS_VALIDES);
      const nomOriginal = centre.nom.value;
      centre.modifier({ ville: 'Paris' });
      expect(centre.nom.value).toBe(nomOriginal);
      expect(centre.ville.value).toBe('Paris');
    });

    it('normalise les valeurs via les VOs', () => {
      const centre = Centre.create(PARAMS_VALIDES);
      centre.modifier({ nom: '  Nouveau Nom  ' });
      expect(centre.nom.value).toBe('Nouveau Nom');
    });

    it('efface le téléphone avec null', () => {
      const centre = Centre.create({ ...PARAMS_VALIDES, telephone: '0612345678' });
      centre.modifier({ telephone: null });
      expect(centre.telephone).toBeUndefined();
    });

    it("efface l'email avec null", () => {
      const centre = Centre.create({ ...PARAMS_VALIDES, email: 'a@a.fr' });
      centre.modifier({ email: null });
      expect(centre.email).toBeUndefined();
    });

    it('ne modifie pas les champs absents du payload', () => {
      const centre = Centre.create({ ...PARAMS_VALIDES, telephone: '0612345678' });
      centre.modifier({ nom: 'Nouveau Nom' });
      expect(centre.telephone?.value).toBe('+33612345678');
    });

    it('met à jour updatedAt', () => {
      const centre = Centre.create(PARAMS_VALIDES);
      const avant = centre.updatedAt;
      centre.modifier({ nom: 'Nouveau Nom' });
      expect(centre.updatedAt.getTime()).toBeGreaterThanOrEqual(avant.getTime());
    });

    it('lève une exception si le centre est archivé', () => {
      const centre = Centre.create(PARAMS_VALIDES);
      centre.archiver();
      expect(() => centre.modifier({ nom: 'Test' })).toThrow(DomainValidationException);
      expectDomainCode(() => centre.modifier({ nom: 'Test' }), 'CENTRE_ARCHIVED');
    });

    it('rejette un nom invalide dans modifier()', () => {
      const centre = Centre.create(PARAMS_VALIDES);
      expect(() => centre.modifier({ nom: '' })).toThrow(DomainValidationException);
    });
  });
});
