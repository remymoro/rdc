import { Email } from '../value-objects/email.vo';
import { User } from '../entities/user.entity';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  count(): Promise<number>;
  findAllResponsables(filters?: { centreId?: string; isActive?: boolean }): Promise<User[]>;
  save(user: User): Promise<void>;
}
