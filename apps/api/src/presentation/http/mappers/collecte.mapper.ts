import type { Collecte } from '@rdc/domain';
import type { CollecteDto } from '@rdc/shared';

export function mapCollecteToDto(collecte: Collecte): CollecteDto {
  return {
    id: collecte.id.value,
    nom: collecte.nom.value,
    dateDebut: collecte.periode.dateDebut,
    dateFin: collecte.periode.dateFin,
    dateFinSaisie: collecte.periode.dateFinSaisie,
    annee: collecte.periode.annee,
    statut: collecte.statut,
    participations: collecte.participations.map(p => ({
      magasinId: p.magasinId.value,
      statut: p.statut,
    })),
    createdAt: collecte.createdAt,
    updatedAt: collecte.updatedAt,
  };
}
