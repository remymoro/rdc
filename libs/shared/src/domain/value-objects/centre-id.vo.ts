export class CentreId {
  private constructor(readonly value: string) {}

  static create(value: string): CentreId {
    if (!value || value.trim().length === 0) {
      throw new Error('CentreId ne peut pas être vide');
    }
    return new CentreId(value);
  }

  equals(other: CentreId): boolean {
    return this.value === other.value;
  }
}
