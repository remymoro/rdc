import { DomainValidationException } from '../exceptions/domain-validation.exception';

export class Ville {
  private constructor(readonly value: string) {}

  static create(value: string): Ville {
    if (!value || value.trim().length === 0) {
      throw new DomainValidationException('La ville ne peut pas être vide', 'VILLE_EMPTY');
    }

    const normalized = value.trim().replace(/\s+/g, ' ');

    if (normalized.length > 100) {
      throw new DomainValidationException(
        'La ville ne peut pas dépasser 100 caractères',
        'VILLE_TOO_LONG',
      );
    }

    return new Ville(normalized);
  }

  equals(other: Ville): boolean {
    return this.value === other.value;
  }
}
