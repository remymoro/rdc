import { Injectable, computed, inject, signal } from '@angular/core';
import {
  CreerResponsableCentreDto,
  ModifierResponsableCentreDto,
  ResponsableCentreDto,
} from '@rdc/shared';
import { firstValueFrom } from 'rxjs';
import {
  ResponsableCentreFilters,
  ResponsableCentreRepository,
} from '../ports/responsable-centre.repository';

@Injectable({ providedIn: 'root' })
export class ResponsableCentreFacade {
  private readonly repo = inject(ResponsableCentreRepository);

  readonly responsables = signal<ResponsableCentreDto[]>([]);
  readonly loading = signal(false);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);

  readonly actifs = computed(() => this.responsables().filter(r => r.isActive));
  readonly count = computed(() => this.responsables().length);

  clearFeedback(): void {
    this.error.set(null);
    this.success.set(null);
  }

  private getErrorMessage(err: unknown, fallback: string): string {
    if (typeof err === 'object' && err !== null && 'error' in err) {
      const error = (err as { error?: { message?: unknown } }).error;
      if (typeof error?.message === 'string' && error.message.trim()) {
        return error.message;
      }
    }

    return fallback;
  }

  async charger(filters?: ResponsableCentreFilters): Promise<boolean> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const data = await firstValueFrom(this.repo.findAll(filters));
      this.responsables.set(data);
      return true;
    } catch (err: unknown) {
      this.error.set(this.getErrorMessage(err, 'Erreur lors du chargement des responsables'));
      return false;
    } finally {
      this.loading.set(false);
    }
  }

  async creer(dto: CreerResponsableCentreDto): Promise<ResponsableCentreDto | null> {
    this.submitting.set(true);
    this.error.set(null);
    this.success.set(null);

    try {
      const created = await firstValueFrom(this.repo.create(dto));
      this.responsables.update(list => [created, ...list]);
      this.success.set('Responsable cree avec succes');
      return created;
    } catch (err: unknown) {
      this.error.set(this.getErrorMessage(err, 'Erreur lors de la creation'));
      return null;
    } finally {
      this.submitting.set(false);
    }
  }

  async modifier(id: string, dto: ModifierResponsableCentreDto): Promise<ResponsableCentreDto | null> {
    this.submitting.set(true);
    this.error.set(null);
    this.success.set(null);

    try {
      const updated = await firstValueFrom(this.repo.update(id, dto));
      this.responsables.update(list => list.map(item => (item.id === id ? updated : item)));
      this.success.set('Responsable mis a jour');
      return updated;
    } catch (err: unknown) {
      this.error.set(this.getErrorMessage(err, 'Erreur lors de la modification'));
      return null;
    } finally {
      this.submitting.set(false);
    }
  }

  async supprimer(id: string): Promise<boolean> {
    this.submitting.set(true);
    this.error.set(null);
    this.success.set(null);

    try {
      await firstValueFrom(this.repo.delete(id));
      this.responsables.update(list =>
        list.map(item => (item.id === id ? { ...item, isActive: false } : item))
      );
      this.success.set('Responsable desactive');
      return true;
    } catch (err: unknown) {
      this.error.set(this.getErrorMessage(err, 'Erreur lors de la suppression'));
      return false;
    } finally {
      this.submitting.set(false);
    }
  }

  async reactiver(id: string): Promise<ResponsableCentreDto | null> {
    this.submitting.set(true);
    this.error.set(null);
    this.success.set(null);

    try {
      const updated = await firstValueFrom(this.repo.update(id, { isActive: true }));
      this.responsables.update(list => list.map(item => (item.id === id ? updated : item)));
      this.success.set('Responsable reactive');
      return updated;
    } catch (err: unknown) {
      this.error.set(this.getErrorMessage(err, 'Erreur lors de la reactivation'));
      return null;
    } finally {
      this.submitting.set(false);
    }
  }
}
