import { Component, inject } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { AuthFacade } from '../../application/facades/auth.facade';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [TagModule],
  template: `
    <section class="space-y-5">
      <header>
        <h1 class="text-2xl font-semibold text-slate-800">Mon profil</h1>
        <p class="text-sm text-slate-500">Informations de connexion et rôle</p>
      </header>

      <article class="rounded-2xl border border-slate-200 bg-white/85 backdrop-blur p-5 shadow-sm space-y-3">
        <p class="text-sm text-slate-500">Email</p>
        <p class="text-lg text-slate-800 font-medium">{{ auth.user()?.email }}</p>

        <div class="pt-2 flex items-center gap-2">
          <span class="text-sm text-slate-500">Rôle</span>
          <p-tag [value]="auth.user()?.role || 'N/A'" [severity]="auth.isAdmin() ? 'warn' : 'info'" />
        </div>

        @if (auth.user()?.centreId) {
          <div class="pt-2 text-sm text-slate-600">
            Centre attribué: <span class="font-medium">{{ auth.user()?.centreId }}</span>
          </div>
        }
      </article>
    </section>
  `,
})
export class ProfilComponent {
  readonly auth = inject(AuthFacade);
}
