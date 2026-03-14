import type { Magasin } from '@rdc/domain';
import type { MagasinDto } from '@rdc/shared';
import type { IBlobStorageService } from '../../../application/blob-storage/interfaces/blob-storage.port';

export function extractBlobName(url: string): string {
  return new URL(url).pathname.replace(/^\/[^/]+\//, '');
}

export function mapMagasinToDto(magasin: Magasin, blobStorage?: IBlobStorageService): MagasinDto {
  return {
    id: magasin.id.value,
    nom: magasin.nom.value,
    ville: magasin.ville.value,
    codePostal: magasin.codePostal.value,
    adresse: magasin.adresse.value,
    telephone: magasin.telephone?.value,
    email: magasin.email?.value,
    statut: magasin.statut,
    centreId: magasin.centreId.value,
    images: magasin.images.map(img => ({
      ...img,
      url: blobStorage ? blobStorage.generateSasUrl(extractBlobName(img.url)) : img.url,
    })),
    createdAt: magasin.createdAt,
    updatedAt: magasin.updatedAt,
  };
}