// DTOs partagés front + back
export type { CentreDto, CreerCentreDto, ModifierCentreDto } from './centre';
export type { AuthTokenDto, AuthUserDto, LoginDto } from './auth';
export type {
  ResponsableCentreDto,
  CreerResponsableCentreDto,
  ModifierResponsableCentreDto,
} from './responsable';
export type { MagasinDto, MagasinImageDto, CreerMagasinDto, ModifierMagasinDto } from './magasin';
export type { CollecteDto, ParticipationMagasinDto, CollecteParticipationCentreDto, MagasinParticipantDto } from './collecte';
