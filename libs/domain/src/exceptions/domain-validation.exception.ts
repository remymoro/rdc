import { DomainException } from './domain.exception';

export class DomainValidationException extends DomainException {
  constructor(message: string, code = 'DOMAIN_VALIDATION') {
    super(message, code);
    this.name = 'DomainValidationException';
  }
}
