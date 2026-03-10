import { DomainException } from './domain.exception';

export class DomainNotFoundException extends DomainException {
  constructor(message: string, code = 'DOMAIN_NOT_FOUND') {
    super(message, code);
    this.name = 'DomainNotFoundException';
  }
}
