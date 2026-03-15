import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { CreerCollecteUseCase } from '../../../application/use-cases/collecte/creer-collecte.usecase';
import { ListerCollectesUseCase } from '../../../application/use-cases/collecte/lister-collectes.usecase';
import { OuvrirInscriptionsUseCase } from '../../../application/use-cases/collecte/ouvrir-inscriptions.usecase';
import { AjouterMagasinCollecteUseCase } from '../../../application/use-cases/collecte/ajouter-magasin-collecte.usecase';
import { CreerCollecteRequest } from '../dtos/creer-collecte.request';
import { mapCollecteToDto } from '../mappers/collecte.mapper';

@Controller('collectes')
@UseGuards(AccessTokenGuard)
export class CollecteController {
  constructor(
    private readonly creerCollecte: CreerCollecteUseCase,
    private readonly listerCollectes: ListerCollectesUseCase,
    private readonly ouvrirInscriptions: OuvrirInscriptionsUseCase,
    private readonly ajouterMagasin: AjouterMagasinCollecteUseCase,
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
}
