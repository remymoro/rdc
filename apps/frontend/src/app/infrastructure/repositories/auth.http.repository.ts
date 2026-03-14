import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthUserDto, LoginDto } from '@rdc/shared';
import { AuthRepository, AuthSessionDto } from '../../application/ports/auth.repository';

@Injectable()
export class AuthHttpRepository extends AuthRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/auth';

  login(dto: LoginDto): Observable<AuthSessionDto> {
    return this.http.post<AuthSessionDto>(`${this.apiUrl}/login`, dto, {
      withCredentials: true,
    });
  }

  refresh(): Observable<AuthSessionDto> {
    return this.http.post<AuthSessionDto>(`${this.apiUrl}/refresh`, {}, {
      withCredentials: true,
    });
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}, {
      withCredentials: true,
    });
  }

  me(): Observable<AuthUserDto> {
    return this.http.get<AuthUserDto>(`${this.apiUrl}/me`);
  }
}
