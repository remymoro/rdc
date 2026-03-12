import { Inject, Injectable } from '@nestjs/common';
import type { ICentreRepository } from '@rdc/domain';
import type { CentreDto } from '@rdc/shared';

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
      ville: centre.ville.value,
      codePostal: centre.codePostal.value,
      adresse: centre.adresse.value,
      telephone: centre.telephone?.value,
      email: centre.email?.value,
      statut: centre.statut,
      createdAt: centre.createdAt,
      updatedAt: centre.updatedAt,
    }));
  }
}
