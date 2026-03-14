import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { DomainConflictException, DomainNotFoundException } from '@rdc/domain';
import { CreerCentreUseCase } from '../../../application/use-cases/centre/creer-centre.usecase';
import { ListerCentresUseCase } from '../../../application/use-cases/centre/lister-centres.usecase';
import { ModifierCentreUseCase } from '../../../application/use-cases/centre/modifier-centre.usecase';
import { DesactiverCentreUseCase } from '../../../application/use-cases/centre/desactiver-centre.usecase';
import { ArchiverCentreUseCase } from '../../../application/use-cases/centre/archiver-centre.usecase';
import { ActiverCentreUseCase } from '../../../application/use-cases/centre/activer-centre.usecase';
import { DomainExceptionFilter } from '../filters/domain-exception.filter';
import { RequestValidationExceptionFilter } from '../filters/request-validation-exception.filter';
import { CentreController } from './centre.controller';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { CentreAccessGuard } from '../guards/centre-access.guard';

const UUID = '550e8400-e29b-41d4-a716-446655440000';

const centreDto = {
  id: UUID,
  nom: 'Centre Bordeaux',
  ville: 'Bordeaux',
  codePostal: '33000',
  adresse: '12 rue de la Paix',
  statut: 'ACTIF',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const validBody = {
  nom: 'Centre Bordeaux',
  ville: 'Bordeaux',
  codePostal: '33000',
  adresse: '12 rue de la Paix',
};

describe('CentreController', () => {
  let app: INestApplication;

  const mockCreerCentre = { execute: jest.fn() };
  const mockListerCentres = { execute: jest.fn() };
  const mockModifierCentre = { execute: jest.fn() };
  const mockDesactiverCentre = { execute: jest.fn() };
  const mockArchiverCentre = { execute: jest.fn() };
  const mockActiverCentre = { execute: jest.fn() };
  const mockAccessTokenGuard = { canActivate: jest.fn().mockReturnValue(true) };
  const mockCentreAccessGuard = { canActivate: jest.fn().mockReturnValue(true) };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CentreController],
      providers: [
        { provide: CreerCentreUseCase, useValue: mockCreerCentre },
        { provide: ListerCentresUseCase, useValue: mockListerCentres },
        { provide: ModifierCentreUseCase, useValue: mockModifierCentre },
        { provide: DesactiverCentreUseCase, useValue: mockDesactiverCentre },
        { provide: ArchiverCentreUseCase, useValue: mockArchiverCentre },
        { provide: ActiverCentreUseCase, useValue: mockActiverCentre },
        { provide: AccessTokenGuard, useValue: mockAccessTokenGuard },
        { provide: CentreAccessGuard, useValue: mockCentreAccessGuard },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalFilters(
      new DomainExceptionFilter(),
      new RequestValidationExceptionFilter(),
    );
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();
  });

  afterAll(() => app.close());

  beforeEach(() => jest.clearAllMocks());

  // ─── POST /centres ───────────────────────────────────────────────────────────

  describe('POST /centres', () => {
    it('201 — crée un centre et retourne le DTO', async () => {
      mockCreerCentre.execute.mockResolvedValue(centreDto);

      const res = await request(app.getHttpServer())
        .post('/centres')
        .send(validBody)
        .expect(201);

      expect(res.body.nom).toBe('Centre Bordeaux');
      expect(res.body.statut).toBe('ACTIF');
      expect(mockCreerCentre.execute).toHaveBeenCalledWith(validBody);
    });

    it('400 — corps invalide (champs obligatoires manquants)', async () => {
      const res = await request(app.getHttpServer())
        .post('/centres')
        .send({ nom: 'Test' })
        .expect(400);

      expect(res.body.code).toBe('REQUEST_VALIDATION');
    });

    it('400 — champ inconnu rejeté (forbidNonWhitelisted)', async () => {
      const res = await request(app.getHttpServer())
        .post('/centres')
        .send({ ...validBody, champlel: 'inconnu' })
        .expect(400);

      expect(res.body.code).toBe('REQUEST_VALIDATION');
    });

    it('409 — centre déjà existant', async () => {
      mockCreerCentre.execute.mockRejectedValue(
        new DomainConflictException('Centre exists', 'CENTRE_ALREADY_EXISTS'),
      );

      const res = await request(app.getHttpServer())
        .post('/centres')
        .send(validBody)
        .expect(409);

      expect(res.body.code).toBe('CENTRE_ALREADY_EXISTS');
    });
  });

  // ─── GET /centres ────────────────────────────────────────────────────────────

  describe('GET /centres', () => {
    it('200 — retourne la liste des centres', async () => {
      mockListerCentres.execute.mockResolvedValue([centreDto]);

      const res = await request(app.getHttpServer())
        .get('/centres')
        .expect(200);

      expect(res.body).toHaveLength(1);
      expect(res.body[0].nom).toBe('Centre Bordeaux');
    });

    it('200 — retourne tableau vide', async () => {
      mockListerCentres.execute.mockResolvedValue([]);

      const res = await request(app.getHttpServer())
        .get('/centres')
        .expect(200);

      expect(res.body).toEqual([]);
    });
  });

  // ─── PATCH /centres/:id ──────────────────────────────────────────────────────

  describe('PATCH /centres/:id', () => {
    it('200 — modifie partiellement le centre', async () => {
      const updated = { ...centreDto, nom: 'Nouveau Nom' };
      mockModifierCentre.execute.mockResolvedValue(updated);

      const res = await request(app.getHttpServer())
        .patch(`/centres/${UUID}`)
        .send({ nom: 'Nouveau Nom' })
        .expect(200);

      expect(res.body.nom).toBe('Nouveau Nom');
      expect(mockModifierCentre.execute).toHaveBeenCalledWith(UUID, { nom: 'Nouveau Nom' });
    });

    it('400 — valeur invalide (nom vide)', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/centres/${UUID}`)
        .send({ nom: '' })
        .expect(400);

      expect(res.body.code).toBe('REQUEST_VALIDATION');
    });

    it('404 — centre introuvable', async () => {
      mockModifierCentre.execute.mockRejectedValue(
        new DomainNotFoundException('Centre not found', 'CENTRE_NOT_FOUND'),
      );

      const res = await request(app.getHttpServer())
        .patch(`/centres/${UUID}`)
        .send({ nom: 'Test' })
        .expect(404);

      expect(res.body.code).toBe('CENTRE_NOT_FOUND');
    });
  });

  // ─── PATCH /centres/:id/desactiver ───────────────────────────────────────────

  describe('PATCH /centres/:id/desactiver', () => {
    it('204 — désactive le centre', async () => {
      mockDesactiverCentre.execute.mockResolvedValue(undefined);

      await request(app.getHttpServer())
        .patch(`/centres/${UUID}/desactiver`)
        .expect(204);

      expect(mockDesactiverCentre.execute).toHaveBeenCalledWith(UUID);
    });

    it('404 — centre introuvable', async () => {
      mockDesactiverCentre.execute.mockRejectedValue(
        new DomainNotFoundException('Centre not found', 'CENTRE_NOT_FOUND'),
      );

      const res = await request(app.getHttpServer())
        .patch(`/centres/${UUID}/desactiver`)
        .expect(404);

      expect(res.body.code).toBe('CENTRE_NOT_FOUND');
    });
  });

  // ─── PATCH /centres/:id/archiver ─────────────────────────────────────────────

  describe('PATCH /centres/:id/archiver', () => {
    it('204 — archive le centre', async () => {
      mockArchiverCentre.execute.mockResolvedValue(undefined);

      await request(app.getHttpServer())
        .patch(`/centres/${UUID}/archiver`)
        .expect(204);

      expect(mockArchiverCentre.execute).toHaveBeenCalledWith(UUID);
    });

    it('404 — centre introuvable', async () => {
      mockArchiverCentre.execute.mockRejectedValue(
        new DomainNotFoundException('Centre not found', 'CENTRE_NOT_FOUND'),
      );

      const res = await request(app.getHttpServer())
        .patch(`/centres/${UUID}/archiver`)
        .expect(404);

      expect(res.body.code).toBe('CENTRE_NOT_FOUND');
    });
  });

  // ─── PATCH /centres/:id/activer ──────────────────────────────────────────────

  describe('PATCH /centres/:id/activer', () => {
    it('204 — réactive le centre', async () => {
      mockActiverCentre.execute.mockResolvedValue(undefined);

      await request(app.getHttpServer())
        .patch(`/centres/${UUID}/activer`)
        .expect(204);

      expect(mockActiverCentre.execute).toHaveBeenCalledWith(UUID);
    });

    it('404 — centre introuvable', async () => {
      mockActiverCentre.execute.mockRejectedValue(
        new DomainNotFoundException('Centre not found', 'CENTRE_NOT_FOUND'),
      );

      const res = await request(app.getHttpServer())
        .patch(`/centres/${UUID}/activer`)
        .expect(404);

      expect(res.body.code).toBe('CENTRE_NOT_FOUND');
    });
  });
});
