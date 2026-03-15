import { Module } from '@nestjs/common';
import { PrismaModule } from '../infrastructure/prisma/prisma.module';
import { AuthModule } from './auth.module';
import { CentreModule } from './centre.module';
import { MagasinModule } from './magasin.module';
import { CollecteController } from '../presentation/http/controllers/collecte.controller';

import { CollectePrismaRepository } from '../infrastructure/repositories/collecte.prisma.repository';

import { CreerCollecteUseCase } from '../application/use-cases/collecte/creer-collecte.usecase';
import { ListerCollectesUseCase } from '../application/use-cases/collecte/lister-collectes.usecase';
import { OuvrirInscriptionsUseCase } from '../application/use-cases/collecte/ouvrir-inscriptions.usecase';
import { AjouterMagasinCollecteUseCase } from '../application/use-cases/collecte/ajouter-magasin-collecte.usecase';
import { RetirerMagasinCollecteUseCase } from '../application/use-cases/collecte/retirer-magasin-collecte.usecase';
import { ListerParticipationsCentreUseCase } from '../application/use-cases/collecte/lister-participations-centre.usecase';

@Module({
  imports: [PrismaModule, AuthModule, CentreModule, MagasinModule],
  controllers: [CollecteController],
  providers: [
    {
      provide: 'ICollecteRepository',
      useClass: CollectePrismaRepository,
    },
    CreerCollecteUseCase,
    ListerCollectesUseCase,
    OuvrirInscriptionsUseCase,
    AjouterMagasinCollecteUseCase,
    RetirerMagasinCollecteUseCase,
    ListerParticipationsCentreUseCase,
  ],
  exports: ['ICollecteRepository'],
})
export class CollecteModule {}
