import { Inject, Injectable } from '@nestjs/common';
import {
  Collecte,
  DomainConflictException,
  ICollecteRepository,
} from '@rdc/domain';
import { randomUUID } from 'crypto';

@Injectable()
export class CreerCollecteUseCase {
  constructor(
    @Inject('ICollecteRepository') private readonly collectes: ICollecteRepository,
  ) {}

  async execute(params: {
    nom: string;
    dateDebut: Date;
    dateFin: Date;
    dateFinSaisie: Date;
  }): Promise<Collecte> {
    // 1. Vérification — pas deux collectes avec le même nom
    const toutes = await this.collectes.findAll();
    const existe = toutes.some(c => c.nom.value === params.nom.trim());

    if (existe) {
      throw new DomainConflictException(
        `Une collecte "${params.nom}" existe déjà`,
        'COLLECTE_ALREADY_EXISTS',
      );
    }

    // 2. Création en mémoire — le domaine valide les dates
    const collecte = Collecte.create({
      id: randomUUID(),
      nom: params.nom,
      dateDebut: params.dateDebut,
      dateFin: params.dateFin,
      dateFinSaisie: params.dateFinSaisie,
    });

    // 3. Persistance
    await this.collectes.save(collecte);

    return collecte;
  }
}
