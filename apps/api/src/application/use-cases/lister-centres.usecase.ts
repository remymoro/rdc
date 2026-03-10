import { Inject, Injectable } from '@nestjs/common';
import { CentreDto } from '@rdc/shared';
import type { ICentreRepository } from '@rdc/shared';

@Injectable()
export class ListerCentresUseCase {
  constructor(
    @Inject('ICentreRepository') private readonly centreRepository: ICentreRepository,
  ) {}

  async execute(): Promise<CentreDto[]> {
    const centres = await this.centreRepository.findAll();

    return centres.map(centre => ({
      id: centre.id.value,
      nom: centre.nom.value,
      ville: centre.ville,
      codePostal: centre.codePostal.value,
      adresse: centre.adresse,
      telephone: centre.telephone,
      email: centre.email,
      statut: centre.statut,
      createdAt: centre.createdAt,
      updatedAt: centre.updatedAt,
    }));
  }
}
