import type { Magasin } from '@rdc/domain';
import type { MagasinDto } from '@rdc/shared';

export function mapMagasinToDto(magasin: Magasin): MagasinDto {
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
    images: magasin.images,
    createdAt: magasin.createdAt,
    updatedAt: magasin.updatedAt,
  };
}