export class CodePostal {
  private constructor(readonly value: string) {}

  static create(value: string): CodePostal {
    if (!value || !/^\d{5}$/.test(value)) {
      throw new Error('Le code postal doit contenir exactement 5 chiffres');
    }
    return new CodePostal(value);
  }

  equals(other: CodePostal): boolean {
    return this.value === other.value;
  }
}
