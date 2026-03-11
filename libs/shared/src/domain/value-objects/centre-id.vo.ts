import { DomainValidationException } from '../exceptions/domain-validation.exception';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class CentreId {
  private constructor(readonly value: string) {}

  static create(value: string): CentreId {
    if (!value || value.trim().length === 0) {
      throw new DomainValidationException('CentreId ne peut pas être vide', 'CENTRE_ID_EMPTY');
    }
    if (!UUID_REGEX.test(value)) {
      throw new DomainValidationException('CentreId doit être un UUID valide', 'CENTRE_ID_INVALID');
    }
    return new CentreId(value);
  }

  equals(other: CentreId): boolean {
    return this.value === other.value;
  }
}
