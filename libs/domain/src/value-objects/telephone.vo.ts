import { DomainValidationException } from '../exceptions/domain-validation.exception';

export class Telephone {
  private constructor(readonly value: string) {}

  static create(value: string): Telephone {
    if (!value || value.trim().length === 0) {
      throw new DomainValidationException('Le téléphone ne peut pas être vide', 'TELEPHONE_EMPTY');
    }

    const stripped = value.replace(/[\s.\-()]/g, '');

    let normalized: string;
    if (stripped.startsWith('+33')) {
      normalized = '+33' + stripped.slice(3);
    } else if (stripped.startsWith('0')) {
      normalized = '+33' + stripped.slice(1);
    } else {
      throw new DomainValidationException(
        'Le téléphone doit être un numéro français valide',
        'TELEPHONE_INVALID',
      );
    }

    if (!/^\+33[1-79]\d{8}$/.test(normalized)) {
      throw new DomainValidationException(
        'Le téléphone doit être un numéro français valide (01-07, 09)',
        'TELEPHONE_INVALID',
      );
    }

    return new Telephone(normalized);
  }

  equals(other: Telephone): boolean {
    return this.value === other.value;
  }
}
