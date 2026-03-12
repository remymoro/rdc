import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { AccessTokenGuard } from './access-token.guard';

@Injectable()
export class CentreAccessGuard implements CanActivate {
  constructor(private readonly accessTokenGuard: AccessTokenGuard) {}

  canActivate(context: ExecutionContext): boolean {
    if (process.env.AUTH_PROTECT_CENTRES !== 'true') {
      return true;
    }

    const allowed = this.accessTokenGuard.canActivate(context);
    if (!allowed) {
      return false;
    }

    const request = context.switchToHttp().getRequest<{ method: string; user?: { role: string } }>();
    const method = request.method.toUpperCase();
    const isReadOnly = method === 'GET' || method === 'HEAD' || method === 'OPTIONS';

    if (!isReadOnly && request.user?.role !== 'ADMIN') {
      throw new ForbiddenException('Action reservee aux administrateurs');
    }

    return true;
  }
}
