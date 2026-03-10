import { Inject, Injectable } from '@nestjs/common';
import { Centre, CreerCentreDto, CentreDto } from '@rdc/shared';
import type { ICentreRepository } from '@rdc/shared';
import { randomUUID } from 'crypto';

@Injectable()
export class CreerCentreUseCase {
  constructor(
    @Inject('ICentreRepository') private readonly centreRepository: ICentreRepository,
  ) {}

  async execute(dto: CreerCentreDto): Promise<CentreDto> {
    const centre = Centre.create({
      id: randomUUID(),
      nom: dto.nom,
      ville: dto.ville,
      codePostal: dto.codePostal,
      adresse: dto.adresse,
      telephone: dto.telephone,
      email: dto.email,
    });

    await this.centreRepository.save(centre);

    return {
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
    };
  }
}
