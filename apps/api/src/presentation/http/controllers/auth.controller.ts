import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  ForbiddenException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { BootstrapAdminUseCase } from '../../../application/use-cases/auth/bootstrap-admin.usecase';
import { LoginUseCase } from '../../../application/use-cases/auth/login.usecase';
import { LogoutUseCase } from '../../../application/use-cases/auth/logout.usecase';
import { MeUseCase } from '../../../application/use-cases/auth/me.usecase';
import { RefreshTokenUseCase } from '../../../application/use-cases/auth/refresh-token.usecase';
import { BootstrapAdminRequest } from '../dtos/bootstrap-admin.request';
import { LoginRequest } from '../dtos/login.request';
import { CreerResponsableRequest } from '../dtos/creer-responsable.request';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { getCookieValue } from '../utils/cookies';
import { TokenService } from '../../../infrastructure/security/token.service';
import { CreerResponsableUseCase } from '../../../application/use-cases/auth/creer-responsable.usecase';

const REFRESH_COOKIE = 'refresh_token';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly bootstrapAdmin: BootstrapAdminUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly meUseCase: MeUseCase,
    private readonly creerResponsableUseCase: CreerResponsableUseCase,
    private readonly tokenService: TokenService,
  ) {}

  @Post('bootstrap-admin')
  @HttpCode(HttpStatus.CREATED)
  async bootstrap(@Body() body: BootstrapAdminRequest): Promise<{ message: string }> {
    await this.bootstrapAdmin.execute(body.email, body.password);
    return { message: 'Admin initialise' };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginRequest, @Res({ passthrough: true }) res: Response) {
    const result = await this.loginUseCase.execute(body);
    this.setRefreshCookie(res, result.refreshToken);

    return {
      auth: result.auth,
      user: result.user,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = getCookieValue(req.headers.cookie, REFRESH_COOKIE);
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token manquant');
    }

    const result = await this.refreshUseCase.execute(refreshToken);
    this.setRefreshCookie(res, result.refreshToken);

    return {
      auth: result.auth,
      user: result.user,
    };
  }

  @Post('responsables')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.CREATED)
  async creerResponsable(
    @Req() req: Request & { user?: { userId: string; role: string } },
    @Body() body: CreerResponsableRequest,
  ) {
    if (req.user?.role !== 'ADMIN') {
      throw new ForbiddenException('Action reservee aux administrateurs');
    }

    return this.creerResponsableUseCase.execute(body);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    const refreshToken = getCookieValue(req.headers.cookie, REFRESH_COOKIE);
    await this.logoutUseCase.execute(refreshToken);
    this.clearRefreshCookie(res);
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  async me(@Req() req: Request & { user?: { userId: string } }) {
    if (!req.user?.userId) {
      throw new UnauthorizedException('Utilisateur non authentifie');
    }

    return this.meUseCase.execute(req.user.userId);
  }

  private setRefreshCookie(res: Response, token: string): void {
    res.cookie(REFRESH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth',
      maxAge: this.tokenService.getRefreshTtlSeconds() * 1000,
    });
  }

  private clearRefreshCookie(res: Response): void {
    res.cookie(REFRESH_COOKIE, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth',
      expires: new Date(0),
    });
  }
}
