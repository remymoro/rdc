import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ITokenService } from '../../../application/auth/interfaces/token-service.port';

export interface RequestUser {
  userId: string;
  email: string;
  role: 'ADMIN' | 'RESPONSABLE_CENTRE';
  centreId?: string;
}

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(@Inject('ITokenService') private readonly tokenService: ITokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string>; user?: RequestUser }>();
    const auth = request.headers.authorization;

    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException('Access token manquant');
    }

    const token = auth.slice(7).trim();
    const payload = this.tokenService.verifyAccessToken(token);

    if (!payload) {
      throw new UnauthorizedException('Access token invalide');
    }

    request.user = {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      centreId: payload.centreId,
    };

    return true;
  }
}
