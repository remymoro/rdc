import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthUserDto, LoginDto } from '@rdc/shared';
import { AuthRepository } from '../ports/auth.repository';

const TOKEN_STORAGE_KEY = 'rdc.auth.v1.accessToken';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly authRepo = inject(AuthRepository);

  readonly accessToken = signal<string | null>(this.readToken());
  readonly user = signal<AuthUserDto | null>(null);
  readonly loading = signal(false);
  readonly initialized = signal(false);
  readonly error = signal<string | null>(null);

  readonly isAuthenticated = computed(() => !!this.accessToken() && !!this.user());
  readonly isAdmin = computed(() => this.user()?.role === 'ADMIN');
  readonly isResponsableCentre = computed(() => this.user()?.role === 'RESPONSABLE_CENTRE');

  init(): void {
    const token = this.accessToken();
    if (!token) {
      this.initialized.set(true);
      return;
    }

    this.loading.set(true);
    this.authRepo.me(token).subscribe({
      next: user => {
        this.user.set(user);
        this.loading.set(false);
        this.initialized.set(true);
      },
      error: () => {
        this.tryRefresh();
      },
    });
  }

  login(dto: LoginDto): void {
    this.loading.set(true);
    this.error.set(null);

    this.authRepo.login(dto).subscribe({
      next: session => {
        this.setSession(session.auth.accessToken, session.user);
        this.loading.set(false);
        this.initialized.set(true);
      },
      error: err => {
        this.clearSession();
        this.error.set(err?.error?.message ?? 'Connexion impossible');
        this.loading.set(false);
        this.initialized.set(true);
      },
    });
  }

  logout(): void {
    this.authRepo.logout().subscribe({
      next: () => this.clearSession(),
      error: () => this.clearSession(),
    });
  }

  clearError(): void {
    this.error.set(null);
  }

  private tryRefresh(): void {
    this.authRepo.refresh().subscribe({
      next: session => {
        this.setSession(session.auth.accessToken, session.user);
        this.loading.set(false);
        this.initialized.set(true);
      },
      error: () => {
        this.clearSession();
        this.loading.set(false);
        this.initialized.set(true);
      },
    });
  }

  private setSession(accessToken: string, user: AuthUserDto): void {
    this.accessToken.set(accessToken);
    this.user.set(user);
    localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
  }

  private clearSession(): void {
    this.accessToken.set(null);
    this.user.set(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  private readToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }
}
