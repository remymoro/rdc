import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { CreerMagasinUseCase } from '../../../application/use-cases/magasin/creer-magasin.usecase';
import { ListerMagasinsUseCase } from '../../../application/use-cases/magasin/lister-magasins.usecase';
import { ObtenirMagasinUseCase } from '../../../application/use-cases/magasin/obtenir-magasin.usecase';
import { ModifierMagasinUseCase } from '../../../application/use-cases/magasin/modifier-magasin.usecase';
import { DesactiverMagasinUseCase } from '../../../application/use-cases/magasin/desactiver-magasin.usecase';
import { ActiverMagasinUseCase } from '../../../application/use-cases/magasin/activer-magasin.usecase';
import { ArchiverMagasinUseCase } from '../../../application/use-cases/magasin/archiver-magasin.usecase';
import { AjouterImageMagasinUseCase } from '../../../application/use-cases/magasin/ajouter-image-magasin.usecase';
import { SupprimerImageMagasinUseCase } from '../../../application/use-cases/magasin/supprimer-image-magasin.usecase';
import { CreerMagasinRequest } from '../dtos/creer-magasin.request';
import { ModifierMagasinRequest } from '../dtos/modifier-magasin.request';
import { CentreAccessGuard } from '../guards/centre-access.guard';
import { mapMagasinToDto } from '../mappers/magasin.mapper';

type AuthRequest = Request & { user?: { role: string; centreId?: string } };

@Controller()
@UseGuards(CentreAccessGuard)
export class MagasinController {
  constructor(
    private readonly creerMagasin: CreerMagasinUseCase,
    private readonly listerMagasins: ListerMagasinsUseCase,
    private readonly obtenirMagasin: ObtenirMagasinUseCase,
    private readonly modifierMagasin: ModifierMagasinUseCase,
    private readonly desactiverMagasin: DesactiverMagasinUseCase,
    private readonly activerMagasin: ActiverMagasinUseCase,
    private readonly archiverMagasin: ArchiverMagasinUseCase,
    private readonly ajouterImage: AjouterImageMagasinUseCase,
    private readonly supprimerImage: SupprimerImageMagasinUseCase,
  ) {}

  @Post('centres/:centreId/magasins')
  @HttpCode(HttpStatus.CREATED)
  async creer(
    @Param('centreId') centreId: string,
    @Body() body: CreerMagasinRequest,
    @Req() req: AuthRequest,
  ) {
    this.assertCentreAccess(req, centreId);
    const magasin = await this.creerMagasin.execute({ ...body, centreId });
    return mapMagasinToDto(magasin);
  }

  @Get('centres/:centreId/magasins')
  async lister(
    @Param('centreId') centreId: string,
    @Req() req: AuthRequest,
  ) {
    this.assertCentreAccess(req, centreId);
    const magasins = await this.listerMagasins.execute(centreId);
    return magasins.map(mapMagasinToDto);
  }

  @Get('magasins/:id')
  async obtenir(@Param('id') id: string, @Req() req: AuthRequest) {
    const magasin = await this.obtenirMagasin.execute(id);
    this.assertCentreAccess(req, magasin.centreId.value);
    return mapMagasinToDto(magasin);
  }

  @Patch('magasins/:id')
  async modifier(
    @Param('id') id: string,
    @Body() body: ModifierMagasinRequest,
    @Req() req: AuthRequest,
  ) {
    const existing = await this.obtenirMagasin.execute(id);
    this.assertCentreAccess(req, existing.centreId.value);
    const magasin = await this.modifierMagasin.execute(id, body);
    return mapMagasinToDto(magasin);
  }

  @Patch('magasins/:id/desactiver')
  @HttpCode(HttpStatus.NO_CONTENT)
  async desactiver(@Param('id') id: string, @Req() req: AuthRequest) {
    const existing = await this.obtenirMagasin.execute(id);
    this.assertCentreAccess(req, existing.centreId.value);
    return this.desactiverMagasin.execute(id);
  }

  @Patch('magasins/:id/activer')
  @HttpCode(HttpStatus.NO_CONTENT)
  async activer(@Param('id') id: string, @Req() req: AuthRequest) {
    const existing = await this.obtenirMagasin.execute(id);
    this.assertCentreAccess(req, existing.centreId.value);
    return this.activerMagasin.execute(id);
  }

  @Patch('magasins/:id/archiver')
  @HttpCode(HttpStatus.NO_CONTENT)
  async archiver(@Param('id') id: string, @Req() req: AuthRequest) {
    const existing = await this.obtenirMagasin.execute(id);
    this.assertCentreAccess(req, existing.centreId.value);
    return this.archiverMagasin.execute(id);
  }

  @Post('magasins/:id/images')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async ajouterImageHandler(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthRequest,
  ) {
    const existing = await this.obtenirMagasin.execute(id);
    this.assertCentreAccess(req, existing.centreId.value);
    return this.ajouterImage.execute(id, {
      buffer: file.buffer,
      mimeType: file.mimetype,
      originalName: file.originalname,
    });
  }

  @Delete('magasins/:id/images/:imageId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async supprimerImageHandler(
    @Param('id') id: string,
    @Param('imageId') imageId: string,
    @Req() req: AuthRequest,
  ) {
    const existing = await this.obtenirMagasin.execute(id);
    this.assertCentreAccess(req, existing.centreId.value);
    return this.supprimerImage.execute(id, imageId);
  }

  private assertCentreAccess(req: AuthRequest, centreId: string): void {
    if (req.user?.role === 'RESPONSABLE_CENTRE' && req.user.centreId !== centreId) {
      throw new ForbiddenException('Accès refusé à ce centre');
    }
  }
}
