import { Inject, Injectable } from '@nestjs/common';
import {
  CentreId,
  ICollecteRepository,
  IMagasinRepository,
  StatutParticipation,
} from '@rdc/domain';
import { CollecteParticipationCentreDto, MagasinParticipantDto } from '@rdc/shared';

@Injectable()
export class ListerParticipationsCentreUseCase {
  constructor(
    @Inject('ICollecteRepository') private readonly collectes: ICollecteRepository,
    @Inject('IMagasinRepository') private readonly magasins: IMagasinRepository,
  ) {}

  async execute(centreId: string): Promise<CollecteParticipationCentreDto[]> {
    // Tous les magasins du centre (pour croiser avec les participations)
    const magasinsDuCentre = await this.magasins.findByCentreId(CentreId.create(centreId));
    const magasinIds = new Set(magasinsDuCentre.map(m => m.id.value));

    // Toutes les collectes
    const toutesLesCollectes = await this.collectes.findAll();

    const result: CollecteParticipationCentreDto[] = [];

    for (const collecte of toutesLesCollectes) {
      // Participations confirmées appartenant au centre
      const participationsDuCentre = collecte.participations.filter(
        p => magasinIds.has(p.magasinId.value) && p.statut === StatutParticipation.CONFIRME,
      );

      if (!participationsDuCentre.length) continue;

      // Enrichissement avec les détails complets du magasin
      const magasinsEnrichis: MagasinParticipantDto[] = participationsDuCentre.map(p => {
        const magasin = magasinsDuCentre.find(m => m.id.value === p.magasinId.value)!;
        return {
          magasinId: magasin.id.value,
          nom: magasin.nom.value,
          adresse: magasin.adresse.value,
          ville: magasin.ville.value,
          codePostal: magasin.codePostal.value,
          telephone: magasin.telephone?.value,
          email: magasin.email?.value,
          images: magasin.images.map(img => ({
            id: img.id,
            url: img.url,
            ordre: img.ordre,
          })),
          statutParticipation: p.statut,
        };
      });

      result.push({
        collecteId: collecte.id.value,
        nom: collecte.nom.value,
        annee: collecte.periode.annee,
        statut: collecte.statut,
        dateDebut: collecte.periode.dateDebut,
        dateFin: collecte.periode.dateFin,
        dateFinSaisie: collecte.periode.dateFinSaisie,
        magasins: magasinsEnrichis,
      });
    }

    return result;
  }
}
