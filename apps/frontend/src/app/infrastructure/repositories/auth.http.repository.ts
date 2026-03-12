import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthUserDto, LoginDto } from '@rdc/shared';
import { AuthRepository, AuthSessionDto } from '../../application/ports/auth.repository';

@Injectable()
export class AuthHttpRepository extends AuthRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/auth';

  login(dto: LoginDto): Observable<AuthSessionDto> {
    return this.http.post<AuthSessionDto>(`${this.apiUrl}/login`, dto);
  }

  refresh(): Observable<AuthSessionDto> {
    return this.http.post<AuthSessionDto>(`${this.apiUrl}/refresh`, {});
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {});
  }

  me(token: string): Observable<AuthUserDto> {
    return this.http.get<AuthUserDto>(`${this.apiUrl}/me`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    });
  }
}
