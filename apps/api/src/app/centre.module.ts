import { Module } from '@nestjs/common';
import { PrismaModule } from '../infrastructure/prisma/prisma.module';
import { AuthModule } from './auth.module';
import { CentrePrismaRepository } from '../infrastructure/repositories/centre.prisma.repository';
import { CreerCentreUseCase } from '../application/use-cases/centre/creer-centre.usecase';
import { ListerCentresUseCase } from '../application/use-cases/centre/lister-centres.usecase';
import { DesactiverCentreUseCase } from '../application/use-cases/centre/desactiver-centre.usecase';
import { ModifierCentreUseCase } from '../application/use-cases/centre/modifier-centre.usecase';
import { ArchiverCentreUseCase } from '../application/use-cases/centre/archiver-centre.usecase';
import { ActiverCentreUseCase } from '../application/use-cases/centre/activer-centre.usecase';
import { CentreController } from '../presentation/http/controllers/centre.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CentreController],
  providers: [
    {
      provide: 'ICentreRepository',
      useClass: CentrePrismaRepository,
    },
    CreerCentreUseCase,
    ListerCentresUseCase,
    ModifierCentreUseCase,
    DesactiverCentreUseCase,
    ArchiverCentreUseCase,
    ActiverCentreUseCase,
  ],
  exports: ['ICentreRepository'],
})
export class CentreModule {}
