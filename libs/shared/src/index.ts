// Entities
export { Centre, StatutCentre } from './domain/entities/centre.entity';
export type { CentreProps } from './domain/entities/centre.entity';

// Value Objects
export { CentreId } from './domain/value-objects/centre-id.vo';
export { Nom } from './domain/value-objects/nom.vo';
export { CodePostal } from './domain/value-objects/code-postal.vo';
export { Ville } from './domain/value-objects/ville.vo';
export { Adresse } from './domain/value-objects/adresse.vo';
export { Telephone } from './domain/value-objects/telephone.vo';
export { Email } from './domain/value-objects/email.vo';

// Interfaces
export type { ICentreRepository } from './domain/interfaces/centre.repository';

// DTOs
export type { CreerCentreDto } from './domain/dtos/creer-centre.dto';
export type { ModifierCentreDto } from './domain/dtos/modifier-centre.dto';
export type { CentreDto } from './domain/dtos/centre.dto';

// Exceptions
export { DomainException } from './domain/exceptions/domain.exception';
// Test utilities
export { expectDomainCode } from './test-utils';
export { DomainValidationException } from './domain/exceptions/domain-validation.exception';
export { DomainNotFoundException } from './domain/exceptions/domain-not-found.exception';
export { DomainConflictException } from './domain/exceptions/domain-conflict.exception';
