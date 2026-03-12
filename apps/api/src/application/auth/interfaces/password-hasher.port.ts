export interface IPasswordHasher {
  hash(value: string): string;
  verify(value: string, encoded: string): boolean;
}
