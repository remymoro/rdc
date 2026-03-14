import { Inject, Injectable } from '@nestjs/common';
import { Centre, DomainConflictException, ICentreRepository } from '@rdc/domain';
import { randomUUID } from 'crypto';

@Injectable()
export class CreerCentreUseCase {
  constructor(
    @Inject('ICentreRepository') private readonly centreRepository: ICentreRepository,
  ) {}

  async execute(params: {
    nom: string;
    ville: string;
    codePostal: string;
    adresse: string;
    telephone?: string;
    email?: string;
  }): Promise<Centre> {
    const existing = await this.centreRepository.findByUniqueKey({
      nom: params.nom.trim(),
      ville: params.ville.trim(),
      codePostal: params.codePostal.trim(),
      adresse: params.adresse.trim(),
    });

    if (existing) {
      throw new DomainConflictException(
        `Centre déjà existant: ${params.nom} (${params.codePostal} ${params.ville})`,
        'CENTRE_ALREADY_EXISTS',
      );
    }

    const centre = Centre.create({
      id: randomUUID(),
      nom: params.nom,
      ville: params.ville,
      codePostal: params.codePostal,
      adresse: params.adresse,
      telephone: params.telephone,
      email: params.email,
    });

    await this.centreRepository.save(centre);

    return centre;
  }
}
