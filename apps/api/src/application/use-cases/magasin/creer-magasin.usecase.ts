import { Inject, Injectable } from '@nestjs/common';
import {
  CentreId,
  DomainConflictException,
  DomainNotFoundException,
  ICentreRepository,
  IMagasinRepository,
  Magasin,
  MagasinId,
} from '@rdc/domain';
import { randomUUID } from 'crypto';

@Injectable()
export class CreerMagasinUseCase {
  constructor(
    @Inject('IMagasinRepository') private readonly magasins: IMagasinRepository,
    @Inject('ICentreRepository') private readonly centres: ICentreRepository,
  ) {}

  async execute(params: {
    nom: string;
    ville: string;
    codePostal: string;
    adresse: string;
    telephone?: string;
    email?: string;
    centreId: string;
  }): Promise<Magasin> {
    const centreId = CentreId.create(params.centreId);
    const centre = await this.centres.findById(centreId);

    if (!centre) {
      throw new DomainNotFoundException(`Centre ${params.centreId} introuvable`, 'CENTRE_NOT_FOUND');
    }

    const existing = await this.magasins.findByUniqueKey({
      nom: params.nom.trim(),
      ville: params.ville.trim(),
      codePostal: params.codePostal.trim(),
      adresse: params.adresse.trim(),
    });

    if (existing) {
      throw new DomainConflictException(
        `Magasin déjà existant: ${params.nom} (${params.codePostal} ${params.ville})`,
        'MAGASIN_ALREADY_EXISTS',
      );
    }

    const magasin = Magasin.create({
      id: randomUUID(),
      nom: params.nom,
      ville: params.ville,
      codePostal: params.codePostal,
      adresse: params.adresse,
      telephone: params.telephone,
      email: params.email,
      centreId: params.centreId,
    });

    await this.magasins.save(magasin);

    return magasin;
  }
}
