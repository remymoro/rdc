import { DomainException } from './domain.exception';

export class DomainConflictException extends DomainException {
  constructor(message: string, code = 'DOMAIN_CONFLICT') {
    super(message, code);
    this.name = 'DomainConflictException';
  }
}
