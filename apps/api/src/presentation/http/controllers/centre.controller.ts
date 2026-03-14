import { Controller, Get, Post, Patch, Param, Body, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { CreerCentreUseCase } from '../../../application/use-cases/centre/creer-centre.usecase';
import { ListerCentresUseCase } from '../../../application/use-cases/centre/lister-centres.usecase';
import { ModifierCentreUseCase } from '../../../application/use-cases/centre/modifier-centre.usecase';
import { DesactiverCentreUseCase } from '../../../application/use-cases/centre/desactiver-centre.usecase';
import { ArchiverCentreUseCase } from '../../../application/use-cases/centre/archiver-centre.usecase';
import { ActiverCentreUseCase } from '../../../application/use-cases/centre/activer-centre.usecase';
import { CreerCentreRequest } from '../dtos/creer-centre.request';
import { ModifierCentreRequest } from '../dtos/modifier-centre.request';
import { CentreAccessGuard } from '../guards/centre-access.guard';

@Controller('centres')
@UseGuards(CentreAccessGuard)
export class CentreController {
  constructor(
    private readonly creerCentre: CreerCentreUseCase,
    private readonly listerCentres: ListerCentresUseCase,
    private readonly modifierCentre: ModifierCentreUseCase,
    private readonly desactiverCentre: DesactiverCentreUseCase,
    private readonly archiverCentre: ArchiverCentreUseCase,
    private readonly activerCentre: ActiverCentreUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async creer(@Body() body: CreerCentreRequest) {
    return this.creerCentre.execute(body);
  }

  @Get()
  async lister(@Req() req: Request & { user?: { role: string; centreId?: string } }) {
    const centres = await this.listerCentres.execute();

    if (req.user?.role === 'RESPONSABLE_CENTRE') {
      if (!req.user.centreId) {
        return [];
      }
      return centres.filter(centre => centre.id === req.user?.centreId);
    }

    return centres;
  }

  @Patch(':id')
  async modifier(@Param('id') id: string, @Body() body: ModifierCentreRequest) {
    return this.modifierCentre.execute(id, body);
  }

  @Patch(':id/desactiver')
  @HttpCode(HttpStatus.NO_CONTENT)
  async desactiver(@Param('id') id: string) {
    return this.desactiverCentre.execute(id);
  }

  @Patch(':id/archiver')
  @HttpCode(HttpStatus.NO_CONTENT)
  async archiver(@Param('id') id: string) {
    return this.archiverCentre.execute(id);
  }

  @Patch(':id/activer')
  @HttpCode(HttpStatus.NO_CONTENT)
  async activer(@Param('id') id: string) {
    return this.activerCentre.execute(id);
  }
}
