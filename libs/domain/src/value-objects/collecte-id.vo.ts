import { DomainValidationException } from '../exceptions/domain-validation.exception';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class CollecteId {
  private constructor(readonly value: string) {}

  static create(value: string): CollecteId {
    if (!value || value.trim().length === 0) {
      throw new DomainValidationException('CollecteId ne peut pas être vide', 'COLLECTE_ID_EMPTY');
    }
    if (!UUID_REGEX.test(value)) {
      throw new DomainValidationException('CollecteId doit être un UUID valide', 'COLLECTE_ID_INVALID');
    }
    return new CollecteId(value);
  }

  equals(other: CollecteId): boolean {
    return this.value === other.value;
  }
}
