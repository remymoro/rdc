export class Nom {
  private constructor(readonly value: string) {}

  static create(value: string): Nom {
    if (!value || value.trim().length === 0) {
      throw new Error('Le nom ne peut pas être vide');
    }
    if (value.trim().length > 100) {
      throw new Error('Le nom ne peut pas dépasser 100 caractères');
    }
    return new Nom(value.trim());
  }

  equals(other: Nom): boolean {
    return this.value === other.value;
  }
}
