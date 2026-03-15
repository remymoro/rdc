import { Module } from '@nestjs/common';
import { PrismaModule } from '../infrastructure/prisma/prisma.module';
import { AuthModule } from './auth.module';
import { CentreModule } from './centre.module';
import { MagasinPrismaRepository } from '../infrastructure/repositories/magasin.prisma.repository';
import { CreerMagasinUseCase } from '../application/use-cases/magasin/creer-magasin.usecase';
import { ListerMagasinsUseCase } from '../application/use-cases/magasin/lister-magasins.usecase';
import { ObtenirMagasinUseCase } from '../application/use-cases/magasin/obtenir-magasin.usecase';
import { ModifierMagasinUseCase } from '../application/use-cases/magasin/modifier-magasin.usecase';
import { DesactiverMagasinUseCase } from '../application/use-cases/magasin/desactiver-magasin.usecase';
import { ActiverMagasinUseCase } from '../application/use-cases/magasin/activer-magasin.usecase';
import { ArchiverMagasinUseCase } from '../application/use-cases/magasin/archiver-magasin.usecase';
import { AjouterImageMagasinUseCase } from '../application/use-cases/magasin/ajouter-image-magasin.usecase';
import { SupprimerImageMagasinUseCase } from '../application/use-cases/magasin/supprimer-image-magasin.usecase';
import { AzureBlobStorageService } from '../infrastructure/storage/azure-blob-storage.service';
import { MagasinController } from '../presentation/http/controllers/magasin.controller';

@Module({
  imports: [PrismaModule, AuthModule, CentreModule],
  controllers: [MagasinController],
  providers: [
    {
      provide: 'IMagasinRepository',
      useClass: MagasinPrismaRepository,
    },
    {
      provide: 'IBlobStorageService',
      useClass: AzureBlobStorageService,
    },
    CreerMagasinUseCase,
    ListerMagasinsUseCase,
    ObtenirMagasinUseCase,
    ModifierMagasinUseCase,
    DesactiverMagasinUseCase,
    ActiverMagasinUseCase,
    ArchiverMagasinUseCase,
    AjouterImageMagasinUseCase,
    SupprimerImageMagasinUseCase,
  ],
  exports: ['IMagasinRepository'],
})
export class MagasinModule {}
