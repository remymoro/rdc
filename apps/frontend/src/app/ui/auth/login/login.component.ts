import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthFacade } from '../../../application/facades/auth.facade';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, InputTextModule, PasswordModule, ButtonModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div class="w-full max-w-md bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h1 class="text-2xl font-bold text-gray-800 mb-1">Connexion</h1>
        <p class="text-sm text-gray-500 mb-5">RDC - Gestion des centres</p>

        @if (auth.error()) {
          <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {{ auth.error() }}
          </div>
        }

        <form class="flex flex-col gap-4" (ngSubmit)="submit()">
          <div class="flex flex-col gap-1">
            <label for="email" class="text-sm font-medium text-gray-700">Email</label>
            <input id="email" pInputText type="email" [(ngModel)]="email" name="email" required autocomplete="email" />
          </div>

          <div class="flex flex-col gap-1">
            <label for="password" class="text-sm font-medium text-gray-700">Mot de passe</label>
            <p-password
              inputId="password"
              [feedback]="false"
              [toggleMask]="true"
              [(ngModel)]="password"
              name="password"
              required
              autocomplete="current-password" />
          </div>

          <p-button type="submit" [loading]="auth.loading()" label="Se connecter" icon="pi pi-sign-in" />
        </form>
      </div>
    </div>
  `,
})
export class LoginComponent {
  readonly auth = inject(AuthFacade);
  private readonly router = inject(Router);

  email = '';
  password = '';
  private readonly redirectTo = signal('/centres');

  constructor() {
    this.auth.clearError();

    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirectTo');
    if (redirect && redirect.startsWith('/')) {
      this.redirectTo.set(redirect);
    }

    if (this.auth.isAuthenticated()) {
      void this.router.navigateByUrl(this.redirectTo());
    }
  }

  submit(): void {
    this.auth.login({ email: this.email, password: this.password });

    const stop = setInterval(() => {
      if (!this.auth.loading()) {
        clearInterval(stop);
        if (this.auth.isAuthenticated()) {
          void this.router.navigateByUrl(this.redirectTo());
        }
      }
    }, 50);
  }
}
