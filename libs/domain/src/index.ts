// Entities
export { Centre, StatutCentre } from './entities/centre.entity';
export type { CentreProps } from './entities/centre.entity';
export { User, UserRole } from './entities/user.entity';
export type { UserProps } from './entities/user.entity';

// Value Objects
export { CentreId } from './value-objects/centre-id.vo';
export { Nom } from './value-objects/nom.vo';
export { CodePostal } from './value-objects/code-postal.vo';
export { Ville } from './value-objects/ville.vo';
export { Adresse } from './value-objects/adresse.vo';
export { Telephone } from './value-objects/telephone.vo';
export { Email } from './value-objects/email.vo';

// Interfaces (ports)
export type { ICentreRepository } from './interfaces/centre.repository';
export type { IUserRepository } from './interfaces/user.repository';

// Exceptions
export { DomainException } from './exceptions/domain.exception';
export { DomainValidationException } from './exceptions/domain-validation.exception';
export { DomainNotFoundException } from './exceptions/domain-not-found.exception';
export { DomainConflictException } from './exceptions/domain-conflict.exception';
