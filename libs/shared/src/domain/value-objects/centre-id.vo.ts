import { DomainValidationException } from '../exceptions/domain-validation.exception';

export class CentreId {
  private constructor(readonly value: string) {}

  static create(value: string): CentreId {
    if (!value || value.trim().length === 0) {
      throw new DomainValidationException('CentreId ne peut pas être vide', 'CENTRE_ID_EMPTY');
    }
    return new CentreId(value);
  }

  equals(other: CentreId): boolean {
    return this.value === other.value;
  }
}
