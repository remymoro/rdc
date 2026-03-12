import { DomainValidationException } from '../exceptions/domain-validation.exception';

export class CodePostal {
  private constructor(readonly value: string) {}

  static create(value: string): CodePostal {
    if (!value || !/^\d{5}$/.test(value)) {
      throw new DomainValidationException(
        'Le code postal doit contenir exactement 5 chiffres',
        'CODE_POSTAL_INVALID',
      );
    }
    return new CodePostal(value);
  }

  equals(other: CodePostal): boolean {
    return this.value === other.value;
  }
}
