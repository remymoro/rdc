import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { CentreModule } from './centre.module';
import { MagasinModule } from './magasin.module';
import { CollecteController } from '../presentation/http/controllers/collecte.controller';

// Adaptateur — swap ici sans toucher les use cases
import { CollecteInMemoryRepository } from '../infrastructure/repositories/collecte.inmemory.repository';

import { CreerCollecteUseCase } from '../application/use-cases/collecte/creer-collecte.usecase';
import { ListerCollectesUseCase } from '../application/use-cases/collecte/lister-collectes.usecase';
import { OuvrirInscriptionsUseCase } from '../application/use-cases/collecte/ouvrir-inscriptions.usecase';
import { AjouterMagasinCollecteUseCase } from '../application/use-cases/collecte/ajouter-magasin-collecte.usecase';

@Module({
  imports: [AuthModule, CentreModule, MagasinModule],
  controllers: [CollecteController],
  providers: [
    {
      provide: 'ICollecteRepository',
      useClass: CollecteInMemoryRepository, // ← un jour : CollectePrismaRepository
    },
    CreerCollecteUseCase,
    ListerCollectesUseCase,
    OuvrirInscriptionsUseCase,
    AjouterMagasinCollecteUseCase,
  ],
  exports: ['ICollecteRepository'],
})
export class CollecteModule {}
