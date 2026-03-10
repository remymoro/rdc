import { Inject, Injectable } from '@nestjs/common';
import { Centre, CreerCentreDto, CentreDto, DomainConflictException } from '@rdc/shared';
import type { ICentreRepository } from '@rdc/shared';
import { randomUUID } from 'crypto';

@Injectable()
export class CreerCentreUseCase {
  constructor(
    @Inject('ICentreRepository') private readonly centreRepository: ICentreRepository,
  ) {}

  async execute(dto: CreerCentreDto): Promise<CentreDto> {
    const existing = await this.centreRepository.findByUniqueKey({
      nom: dto.nom.trim(),
      ville: dto.ville.trim(),
      codePostal: dto.codePostal.trim(),
      adresse: dto.adresse.trim(),
    });

    if (existing) {
      throw new DomainConflictException(
        `Centre déjà existant: ${dto.nom} (${dto.codePostal} ${dto.ville})`,
        'CENTRE_ALREADY_EXISTS',
      );
    }

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
