import { DomainValidationException } from '../exceptions/domain-validation.exception';

export class Nom {
  private constructor(readonly value: string) {}

  static create(value: string): Nom {
    if (!value || value.trim().length === 0) {
      throw new DomainValidationException('Le nom ne peut pas être vide', 'NOM_EMPTY');
    }
    if (value.trim().length > 100) {
      throw new DomainValidationException(
        'Le nom ne peut pas dépasser 100 caractères',
        'NOM_TOO_LONG',
      );
    }
    return new Nom(value.trim());
  }

  equals(other: Nom): boolean {
    return this.value === other.value;
  }
}
