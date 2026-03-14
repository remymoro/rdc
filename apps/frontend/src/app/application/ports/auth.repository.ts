import { Observable } from 'rxjs';
import { AuthTokenDto, AuthUserDto, LoginDto } from '@rdc/shared';

export interface AuthSessionDto {
  auth: AuthTokenDto;
  user: AuthUserDto;
}

export abstract class AuthRepository {
  abstract login(dto: LoginDto): Observable<AuthSessionDto>;
  abstract refresh(): Observable<AuthSessionDto>;
  abstract logout(): Observable<void>;
  abstract me(): Observable<AuthUserDto>;
}
