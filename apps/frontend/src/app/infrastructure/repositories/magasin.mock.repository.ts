import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CreerMagasinDto, MagasinDto, ModifierMagasinDto } from '@rdc/shared';
import { MagasinFilters, MagasinRepository } from '../../application/ports/magasin.repository';

const magasinStore: MagasinDto[] = [];

function cloneMagasin(magasin: MagasinDto): MagasinDto {
  return {
    ...magasin,
    createdAt: new Date(magasin.createdAt),
    updatedAt: new Date(magasin.updatedAt),
    images: magasin.images.map(image => ({
      ...image,
      createdAt: new Date(image.createdAt),
    })),
  };
}

function cloneMagasins(magasins: MagasinDto[]): MagasinDto[] {
  return magasins.map(cloneMagasin);
}

@Injectable()
export class MagasinMockRepository extends MagasinRepository {
  findAll(filters?: MagasinFilters): Observable<MagasinDto[]> {
    const magasins = filters?.centreId
      ? magasinStore.filter(magasin => magasin.centreId === filters.centreId)
      : magasinStore;

    return of(cloneMagasins(magasins));
  }

  creer(dto: CreerMagasinDto): Observable<MagasinDto> {
    const now = new Date();
    const magasin: MagasinDto = {
      id: crypto.randomUUID(),
      nom: dto.nom.trim(),
      ville: dto.ville.trim(),
      codePostal: dto.codePostal.trim(),
      adresse: dto.adresse.trim(),
      telephone: dto.telephone?.trim() || undefined,
      email: dto.email?.trim() || undefined,
      statut: 'ACTIF',
      centreId: dto.centreId,
      images: [],
      createdAt: now,
      updatedAt: now,
    };

    magasinStore.unshift(magasin);
    return of(cloneMagasin(magasin));
  }

  modifier(id: string, dto: ModifierMagasinDto): Observable<MagasinDto> {
    const magasin = magasinStore.find(item => item.id === id);
    if (!magasin) {
      return of(cloneMagasin(this.fallbackMagasin(id)));
    }

    if (dto.nom !== undefined) {
      magasin.nom = dto.nom.trim();
    }
    if (dto.ville !== undefined) {
      magasin.ville = dto.ville.trim();
    }
    if (dto.codePostal !== undefined) {
      magasin.codePostal = dto.codePostal.trim();
    }
    if (dto.adresse !== undefined) {
      magasin.adresse = dto.adresse.trim();
    }
    if (dto.telephone !== undefined) {
      magasin.telephone = dto.telephone?.trim() || undefined;
    }
    if (dto.email !== undefined) {
      magasin.email = dto.email?.trim() || undefined;
    }
    magasin.updatedAt = new Date();

    return of(cloneMagasin(magasin));
  }

  desactiver(id: string): Observable<void> {
    this.updateStatut(id, 'INACTIF');
    return of(void 0);
  }

  activer(id: string): Observable<void> {
    this.updateStatut(id, 'ACTIF');
    return of(void 0);
  }

  archiver(id: string): Observable<void> {
    this.updateStatut(id, 'ARCHIVE');
    return of(void 0);
  }

  private updateStatut(id: string, statut: MagasinDto['statut']): void {
    const magasin = magasinStore.find(item => item.id === id);
    if (!magasin) {
      return;
    }

    magasin.statut = statut;
    magasin.updatedAt = new Date();
  }

  private fallbackMagasin(id: string): MagasinDto {
    const now = new Date();
    return {
      id,
      nom: 'Magasin introuvable',
      ville: '',
      codePostal: '',
      adresse: '',
      statut: 'INACTIF',
      centreId: '',
      images: [],
      createdAt: now,
      updatedAt: now,
    };
  }
}
