import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthUserDto, LoginDto } from '@rdc/shared';
import { AuthRepository } from '../ports/auth.repository';

const TOKEN_STORAGE_KEY = 'rdc.auth.v1.accessToken';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly authRepo = inject(AuthRepository);
  private initPromise: Promise<void> | null = null;

  readonly accessToken = signal<string | null>(this.readToken());
  readonly user = signal<AuthUserDto | null>(null);
  readonly loading = signal(false);
  readonly initialized = signal(false);
  readonly error = signal<string | null>(null);

  readonly isAuthenticated = computed(() => !!this.accessToken() && !!this.user());
  readonly isAdmin = computed(() => this.user()?.role === 'ADMIN');
  readonly isResponsableCentre = computed(() => this.user()?.role === 'RESPONSABLE_CENTRE');
  readonly homeUrl = computed(() => {
    if (this.isAdmin()) {
      return '/admin';
    }
    if (this.isResponsableCentre()) {
      return '/centre';
    }
    return '/login';
  });

  init(): Promise<void> {
    if (this.initialized()) {
      return Promise.resolve();
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    const token = this.accessToken();
    if (!token) {
      this.initialized.set(true);
      return Promise.resolve();
    }

    this.loading.set(true);
    this.initPromise = new Promise(resolve => {
      this.authRepo.me(token).subscribe({
        next: user => {
          this.user.set(user);
          this.finishInit();
          resolve();
        },
        error: () => {
          this.tryRefresh(resolve);
        },
      });
    });

    return this.initPromise;
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
    const hadToken = !!this.accessToken();
    this.clearSession();
    this.initialized.set(true);

    if (!hadToken) {
      return;
    }

    this.authRepo.logout().subscribe({
      error: () => undefined,
    });
  }

  clearError(): void {
    this.error.set(null);
  }

  private tryRefresh(resolve?: () => void): void {
    this.authRepo.refresh().subscribe({
      next: session => {
        this.setSession(session.auth.accessToken, session.user);
        this.finishInit();
        resolve?.();
      },
      error: () => {
        this.clearSession();
        this.finishInit();
        resolve?.();
      },
    });
  }

  private finishInit(): void {
    this.loading.set(false);
    this.initialized.set(true);
    this.initPromise = null;
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
