import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { CreerCollecteUseCase } from '../../../application/use-cases/collecte/creer-collecte.usecase';
import { ListerCollectesUseCase } from '../../../application/use-cases/collecte/lister-collectes.usecase';
import { OuvrirInscriptionsUseCase } from '../../../application/use-cases/collecte/ouvrir-inscriptions.usecase';
import { AjouterMagasinCollecteUseCase } from '../../../application/use-cases/collecte/ajouter-magasin-collecte.usecase';
import { RetirerMagasinCollecteUseCase } from '../../../application/use-cases/collecte/retirer-magasin-collecte.usecase';
import { ListerParticipationsCentreUseCase } from '../../../application/use-cases/collecte/lister-participations-centre.usecase';
import { CreerCollecteRequest } from '../dtos/creer-collecte.request';
import { mapCollecteToDto } from '../mappers/collecte.mapper';

type AuthRequest = Request & { user?: { centreId?: string } };

@Controller('collectes')
@UseGuards(AccessTokenGuard)
export class CollecteController {
  constructor(
    private readonly creerCollecte: CreerCollecteUseCase,
    private readonly listerCollectes: ListerCollectesUseCase,
    private readonly ouvrirInscriptions: OuvrirInscriptionsUseCase,
    private readonly ajouterMagasin: AjouterMagasinCollecteUseCase,
    private readonly retirerMagasin: RetirerMagasinCollecteUseCase,
    private readonly listerParticipationsCentre: ListerParticipationsCentreUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async creer(@Body() body: CreerCollecteRequest) {
    const collecte = await this.creerCollecte.execute({
      nom: body.nom,
      dateDebut: new Date(body.dateDebut),
      dateFin: new Date(body.dateFin),
      dateFinSaisie: new Date(body.dateFinSaisie),
    });
    return mapCollecteToDto(collecte);
  }

  @Get()
  async lister() {
    const collectes = await this.listerCollectes.execute();
    return collectes.map(mapCollecteToDto);
  }

  @Get('mes-participations')
  async mesParticipations(@Req() req: AuthRequest) {
    const centreId = req.user?.centreId ?? '';
    return this.listerParticipationsCentre.execute(centreId);
  }

  @Patch(':id/ouvrir-inscriptions')
  @HttpCode(HttpStatus.NO_CONTENT)
  async ouvrirInscriptionsRoute(@Param('id') id: string) {
    await this.ouvrirInscriptions.execute(id);
  }

  @Post(':id/magasins/:magasinId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async ajouterMagasinRoute(
    @Param('id') collecteId: string,
    @Param('magasinId') magasinId: string,
  ) {
    await this.ajouterMagasin.execute({ collecteId, magasinId });
  }

  @Delete(':id/magasins/:magasinId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async retirerMagasinRoute(
    @Param('id') collecteId: string,
    @Param('magasinId') magasinId: string,
  ) {
    await this.retirerMagasin.execute({ collecteId, magasinId });
  }
}
