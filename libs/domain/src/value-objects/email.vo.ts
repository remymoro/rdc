import { DomainValidationException } from '../exceptions/domain-validation.exception';

export class Email {
  private constructor(readonly value: string) {}

  static create(value: string): Email {
    if (!value || value.trim().length === 0) {
      throw new DomainValidationException("L'email ne peut pas être vide", 'EMAIL_EMPTY');
    }

    const normalized = value.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      throw new DomainValidationException("Format d'email invalide", 'EMAIL_INVALID');
    }

    return new Email(normalized);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
