import { Module } from '@nestjs/common';
import { PrismaModule } from '../infrastructure/prisma/prisma.module';
import { CentreModule } from '../infrastructure/centre.module';

@Module({
  imports: [PrismaModule, CentreModule],
})
export class AppModule {}
