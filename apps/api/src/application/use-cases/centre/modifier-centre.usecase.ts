import { Inject, Injectable } from '@nestjs/common';
import { CentreId, DomainNotFoundException, DomainConflictException, ICentreRepository } from '@rdc/domain';
import type { CentreDto, ModifierCentreDto } from '@rdc/shared';
import { mapCentreToDto } from './centre.mapper';

@Injectable()
export class ModifierCentreUseCase {
  constructor(
    @Inject('ICentreRepository') private readonly centreRepository: ICentreRepository,
  ) {}

  async execute(id: string, dto: ModifierCentreDto): Promise<CentreDto> {
    const centreId = CentreId.create(id);
    const centre = await this.centreRepository.findById(centreId);

    if (!centre) {
      throw new DomainNotFoundException(`Centre ${id} introuvable`, 'CENTRE_NOT_FOUND');
    }

    centre.modifier(dto);

    const doublon = await this.centreRepository.findByUniqueKey({
      nom: centre.nom.value,
      ville: centre.ville.value,
      codePostal: centre.codePostal.value,
      adresse: centre.adresse.value,
    });

    if (doublon && doublon.id.value !== id) {
      throw new DomainConflictException(
        `Centre déjà existant: ${centre.nom.value} (${centre.codePostal.value} ${centre.ville.value})`,
        'CENTRE_ALREADY_EXISTS',
      );
    }

    await this.centreRepository.save(centre);

    return mapCentreToDto(centre);
  }
}
