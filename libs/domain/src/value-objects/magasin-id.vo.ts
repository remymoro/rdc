import { DomainValidationException } from '../exceptions/domain-validation.exception';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class MagasinId {
  private constructor(readonly value: string) {}

  static create(value: string): MagasinId {
    if (!value || value.trim().length === 0) {
      throw new DomainValidationException('MagasinId ne peut pas être vide', 'MAGASIN_ID_EMPTY');
    }
    if (!UUID_REGEX.test(value)) {
      throw new DomainValidationException('MagasinId doit être un UUID valide', 'MAGASIN_ID_INVALID');
    }
    return new MagasinId(value);
  }

  equals(other: MagasinId): boolean {
    return this.value === other.value;
  }
}
