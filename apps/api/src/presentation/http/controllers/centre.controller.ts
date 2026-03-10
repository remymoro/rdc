import { Controller, Get, Post, Patch, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CreerCentreUseCase } from '../../../application/use-cases/creer-centre.usecase';
import { ListerCentresUseCase } from '../../../application/use-cases/lister-centres.usecase';
import { DesactiverCentreUseCase } from '../../../application/use-cases/desactiver-centre.usecase';
import { ArchiverCentreUseCase } from '../../../application/use-cases/archiver-centre.usecase';
import { CreerCentreRequest } from '../dtos/creer-centre.request';

@Controller('centres')
export class CentreController {
  constructor(
    private readonly creerCentre: CreerCentreUseCase,
    private readonly listerCentres: ListerCentresUseCase,
    private readonly desactiverCentre: DesactiverCentreUseCase,
    private readonly archiverCentre: ArchiverCentreUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async creer(@Body() body: CreerCentreRequest) {
    return this.creerCentre.execute(body);
  }

  @Get()
  async lister() {
    return this.listerCentres.execute();
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
}
