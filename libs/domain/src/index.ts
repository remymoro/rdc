// Domain aggregates
export { Centre, StatutCentre } from './centre';
export type { CentreProps, ICentreRepository } from './centre';
export { User, UserRole } from './user';
export type { UserProps, IUserRepository } from './user';

// Value Objects
export { CentreId } from './value-objects/centre-id.vo';
export { Nom } from './value-objects/nom.vo';
export { CodePostal } from './value-objects/code-postal.vo';
export { Ville } from './value-objects/ville.vo';
export { Adresse } from './value-objects/adresse.vo';
export { Telephone } from './value-objects/telephone.vo';
export { Email } from './value-objects/email.vo';

// Exceptions
export { DomainException } from './exceptions/domain.exception';
export { DomainValidationException } from './exceptions/domain-validation.exception';
export { DomainNotFoundException } from './exceptions/domain-not-found.exception';
export { DomainConflictException } from './exceptions/domain-conflict.exception';
