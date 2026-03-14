import { Inject, Injectable } from '@nestjs/common';
import {
  DomainConflictException,
  DomainNotFoundException,
  IMagasinRepository,
  Magasin,
  MagasinId,
} from '@rdc/domain';

@Injectable()
export class ModifierMagasinUseCase {
  constructor(
    @Inject('IMagasinRepository') private readonly magasins: IMagasinRepository,
  ) {}

  async execute(id: string, params: {
    nom?: string;
    ville?: string;
    codePostal?: string;
    adresse?: string;
    telephone?: string | null;
    email?: string | null;
  }): Promise<Magasin> {
    const magasin = await this.magasins.findById(MagasinId.create(id));

    if (!magasin) {
      throw new DomainNotFoundException(`Magasin ${id} introuvable`, 'MAGASIN_NOT_FOUND');
    }

    magasin.modifier(params);

    const doublon = await this.magasins.findByUniqueKey({
      nom: magasin.nom.value,
      ville: magasin.ville.value,
      codePostal: magasin.codePostal.value,
      adresse: magasin.adresse.value,
    });

    if (doublon && doublon.id.value !== id) {
      throw new DomainConflictException(
        `Magasin déjà existant: ${magasin.nom.value} (${magasin.codePostal.value} ${magasin.ville.value})`,
        'MAGASIN_ALREADY_EXISTS',
      );
    }

    await this.magasins.save(magasin);

    return magasin;
  }
}
