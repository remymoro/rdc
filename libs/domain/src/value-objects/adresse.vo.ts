import { DomainValidationException } from '../exceptions/domain-validation.exception';

export class Adresse {
  private constructor(readonly value: string) {}

  static create(value: string): Adresse {
    if (!value || value.trim().length === 0) {
      throw new DomainValidationException("L'adresse ne peut pas être vide", 'ADRESSE_EMPTY');
    }

    const normalized = value.trim().replace(/\s+/g, ' ');

    if (normalized.length > 255) {
      throw new DomainValidationException(
        "L'adresse ne peut pas dépasser 255 caractères",
        'ADRESSE_TOO_LONG',
      );
    }

    return new Adresse(normalized);
  }

  equals(other: Adresse): boolean {
    return this.value === other.value;
  }
}
