import { DomainValidationException } from '../exceptions/domain-validation.exception';
import { Email } from '../value-objects/email.vo';

export enum UserRole {
  ADMIN = 'ADMIN',
  RESPONSABLE_CENTRE = 'RESPONSABLE_CENTRE',
}

export interface UserProps {
  id: string;
  email: Email;
  passwordHash: string;
  role: UserRole;
  centreId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private constructor(private props: UserProps) {}

  static create(params: {
    id: string;
    email: string;
    passwordHash: string;
    role?: UserRole;
    centreId?: string;
    isActive?: boolean;
  }): User {
    if (!params.passwordHash || params.passwordHash.trim().length < 20) {
      throw new DomainValidationException('Le hash du mot de passe est invalide', 'PASSWORD_HASH_INVALID');
    }

    if (params.role === UserRole.RESPONSABLE_CENTRE && !params.centreId) {
      throw new DomainValidationException('Un responsable centre doit etre rattache a un centre', 'USER_CENTRE_REQUIRED');
    }

    const now = new Date();

    return new User({
      id: params.id,
      email: Email.create(params.email),
      passwordHash: params.passwordHash,
      role: params.role ?? UserRole.RESPONSABLE_CENTRE,
      centreId: params.centreId,
      isActive: params.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstituer(props: UserProps): User {
    return new User(props);
  }

  get id(): string {
    return this.props.id;
  }

  get email(): Email {
    return this.props.email;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get centreId(): string | undefined {
    return this.props.centreId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  setPasswordHash(hash: string): void {
    if (!hash || hash.trim().length < 20) {
      throw new DomainValidationException('Le hash du mot de passe est invalide', 'PASSWORD_HASH_INVALID');
    }

    this.props.passwordHash = hash;
    this.props.updatedAt = new Date();
  }

  deactivate(): void {
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }

  activate(): void {
    this.props.isActive = true;
    this.props.updatedAt = new Date();
  }
}
