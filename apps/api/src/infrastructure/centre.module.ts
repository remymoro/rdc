import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CentrePrismaRepository } from './repositories/centre.prisma.repository';
import { CreerCentreUseCase } from '../application/use-cases/creer-centre.usecase';
import { ListerCentresUseCase } from '../application/use-cases/lister-centres.usecase';
import { DesactiverCentreUseCase } from '../application/use-cases/desactiver-centre.usecase';
import { ModifierCentreUseCase } from '../application/use-cases/modifier-centre.usecase';
import { ArchiverCentreUseCase } from '../application/use-cases/archiver-centre.usecase';
import { CentreController } from '../presentation/http/controllers/centre.controller';

@Module({
  imports: [PrismaModule],
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
  ],
})
export class CentreModule {}
