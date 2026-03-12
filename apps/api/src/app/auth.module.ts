import { Module } from '@nestjs/common';
import { PrismaModule } from '../infrastructure/prisma/prisma.module';
import { RefreshTokenSessionPrismaRepository } from '../infrastructure/repositories/refresh-token-session.prisma.repository';
import { UserPrismaRepository } from '../infrastructure/repositories/user.prisma.repository';
import { CentrePrismaRepository } from '../infrastructure/repositories/centre.prisma.repository';
import { PasswordHasherService } from '../infrastructure/security/password-hasher.service';
import { TokenService } from '../infrastructure/security/token.service';
import { AuthController } from '../presentation/http/controllers/auth.controller';
import { ResponsableController } from '../presentation/http/controllers/responsable.controller';
import { AccessTokenGuard } from '../presentation/http/guards/access-token.guard';
import { CentreAccessGuard } from '../presentation/http/guards/centre-access.guard';
import { BootstrapAdminUseCase } from '../application/use-cases/auth/bootstrap-admin.usecase';
import { LoginUseCase } from '../application/use-cases/auth/login.usecase';
import { LogoutUseCase } from '../application/use-cases/auth/logout.usecase';
import { MeUseCase } from '../application/use-cases/auth/me.usecase';
import { RefreshTokenUseCase } from '../application/use-cases/auth/refresh-token.usecase';
import { CreerResponsableUseCase } from '../application/use-cases/auth/creer-responsable.usecase';
import { ListerResponsablesUseCase } from '../application/use-cases/auth/lister-responsables.usecase';
import { ObtenirResponsableUseCase } from '../application/use-cases/auth/obtenir-responsable.usecase';
import { ModifierResponsableUseCase } from '../application/use-cases/auth/modifier-responsable.usecase';
import { SupprimerResponsableUseCase } from '../application/use-cases/auth/supprimer-responsable.usecase';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController, ResponsableController],
  providers: [
    {
      provide: 'IUserRepository',
      useClass: UserPrismaRepository,
    },
    {
      provide: 'ICentreRepository',
      useClass: CentrePrismaRepository,
    },
    {
      provide: 'IRefreshTokenSessionRepository',
      useClass: RefreshTokenSessionPrismaRepository,
    },
    {
      provide: 'IPasswordHasher',
      useClass: PasswordHasherService,
    },
    {
      provide: 'ITokenService',
      useClass: TokenService,
    },
    PasswordHasherService,
    TokenService,
    AccessTokenGuard,
    CentreAccessGuard,
    BootstrapAdminUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    MeUseCase,
    CreerResponsableUseCase,
    ListerResponsablesUseCase,
    ObtenirResponsableUseCase,
    ModifierResponsableUseCase,
    SupprimerResponsableUseCase,
  ],
  exports: [TokenService, AccessTokenGuard, CentreAccessGuard],
})
export class AuthModule {}
