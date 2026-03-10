// Entities
export { Centre, StatutCentre } from './domain/entities/centre.entity';
export type { CentreProps } from './domain/entities/centre.entity';

// Value Objects
export { CentreId } from './domain/value-objects/centre-id.vo';
export { Nom } from './domain/value-objects/nom.vo';
export { CodePostal } from './domain/value-objects/code-postal.vo';

// Interfaces
export type { ICentreRepository } from './domain/interfaces/centre.repository';

// DTOs
export type { CreerCentreDto } from './domain/dtos/creer-centre.dto';
export type { CentreDto } from './domain/dtos/centre.dto';
