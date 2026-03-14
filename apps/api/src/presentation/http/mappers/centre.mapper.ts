import type { Centre } from '@rdc/domain';
import type { CentreDto } from '@rdc/shared';

export function mapCentreToDto(centre: Centre): CentreDto {
  return {
    id: centre.id.value,
    nom: centre.nom.value,
    ville: centre.ville.value,
    codePostal: centre.codePostal.value,
    adresse: centre.adresse.value,
    telephone: centre.telephone?.value,
    email: centre.email?.value,
    statut: centre.statut,
    createdAt: centre.createdAt,
    updatedAt: centre.updatedAt,
  };
}
