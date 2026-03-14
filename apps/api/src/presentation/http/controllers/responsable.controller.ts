import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import type { Request } from 'express';
import { CreerResponsableUseCase } from '../../../application/use-cases/auth/creer-responsable.usecase';
import { ListerResponsablesUseCase } from '../../../application/use-cases/auth/lister-responsables.usecase';
import { ModifierResponsableUseCase } from '../../../application/use-cases/auth/modifier-responsable.usecase';
import { ObtenirResponsableUseCase } from '../../../application/use-cases/auth/obtenir-responsable.usecase';
import { SupprimerResponsableUseCase } from '../../../application/use-cases/auth/supprimer-responsable.usecase';
import { CreerResponsableRequest } from '../dtos/creer-responsable.request';
import { ListerResponsablesQuery } from '../dtos/lister-responsables.query';
import { ModifierResponsableRequest } from '../dtos/modifier-responsable.request';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { toResponsableDto } from '../mappers/responsable-centre.mapper';

@Controller('admin/responsables')
@UseGuards(AccessTokenGuard)
export class ResponsableController {
  constructor(
    private readonly creerResponsable: CreerResponsableUseCase,
    private readonly listerResponsables: ListerResponsablesUseCase,
    private readonly obtenirResponsable: ObtenirResponsableUseCase,
    private readonly modifierResponsable: ModifierResponsableUseCase,
    private readonly supprimerResponsable: SupprimerResponsableUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async creer(@Req() req: Request & { user?: { role: string } }, @Body() body: CreerResponsableRequest) {
    this.assertAdmin(req);
    const user = await this.creerResponsable.execute(body);
    return toResponsableDto(user);
  }

  @Get()
  async lister(@Req() req: Request & { user?: { role: string } }, @Query() query: ListerResponsablesQuery) {
    this.assertAdmin(req);
    const responsables = await this.listerResponsables.execute({
      centreId: query.centreId,
      isActive: query.isActive === undefined ? undefined : query.isActive === 'true',
    });
    return responsables.map(toResponsableDto);
  }

  @Get(':id')
  async obtenir(@Req() req: Request & { user?: { role: string } }, @Param('id') id: string) {
    this.assertAdmin(req);
    const user = await this.obtenirResponsable.execute(id);
    return toResponsableDto(user);
  }

  @Patch(':id')
  async modifier(
    @Req() req: Request & { user?: { role: string } },
    @Param('id') id: string,
    @Body() body: ModifierResponsableRequest,
  ) {
    this.assertAdmin(req);
    const user = await this.modifierResponsable.execute(id, body);
    return toResponsableDto(user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async supprimer(@Req() req: Request & { user?: { role: string } }, @Param('id') id: string): Promise<void> {
    this.assertAdmin(req);
    await this.supprimerResponsable.execute(id);
  }

  private assertAdmin(req: Request & { user?: { role: string } }): void {
    if (req.user?.role !== 'ADMIN') {
      throw new ForbiddenException('Action reservee aux administrateurs');
    }
  }
}
