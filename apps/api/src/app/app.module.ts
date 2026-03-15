import { Module } from '@nestjs/common';
import { PrismaModule } from '../infrastructure/prisma/prisma.module';
import { CentreModule } from './centre.module';
import { AuthModule } from './auth.module';
import { MagasinModule } from './magasin.module';
import { CollecteModule } from './collecte.module';

@Module({
  imports: [PrismaModule, AuthModule, CentreModule, MagasinModule, CollecteModule],
})
export class AppModule {}
