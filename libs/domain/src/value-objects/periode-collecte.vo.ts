import { DomainValidationException } from '../exceptions/domain-validation.exception';

export class PeriodeCollecte {
  private constructor(
    readonly dateDebut: Date,
    readonly dateFin: Date,
    readonly dateFinSaisie: Date,
  ) {}

  static create(dateDebut: Date, dateFin: Date, dateFinSaisie: Date): PeriodeCollecte {
    if (!(dateDebut instanceof Date) || isNaN(dateDebut.getTime())) {
      throw new DomainValidationException(
        'La date de début est invalide',
        'PERIODE_DATE_DEBUT_INVALIDE',
      );
    }
    if (!(dateFin instanceof Date) || isNaN(dateFin.getTime())) {
      throw new DomainValidationException(
        'La date de fin est invalide',
        'PERIODE_DATE_FIN_INVALIDE',
      );
    }
    if (dateFin <= dateDebut) {
      throw new DomainValidationException(
        'La date de fin doit être postérieure à la date de début',
        'PERIODE_DATE_FIN_INVALIDE',
      );
    }
    if (!(dateFinSaisie instanceof Date) || isNaN(dateFinSaisie.getTime())) {
      throw new DomainValidationException(
        'La date de fin de saisie est invalide',
        'PERIODE_DATE_FIN_SAISIE_INVALIDE',
      );
    }
    if (dateFinSaisie <= dateFin) {
      throw new DomainValidationException(
        'La date de fin de saisie doit être postérieure à la fin de la collecte',
        'PERIODE_DATE_FIN_SAISIE_INVALIDE',
      );
    }
    return new PeriodeCollecte(dateDebut, dateFin, dateFinSaisie);
  }

  get annee(): number {
    return this.dateDebut.getFullYear();
  }

  get dureeEnJours(): number {
    return Math.ceil(
      (this.dateFin.getTime() - this.dateDebut.getTime()) / 86_400_000,
    );
  }

  estEnToleranceDeSaisie(now: Date): boolean {
    return now > this.dateFin && now <= this.dateFinSaisie;
  }

  equals(other: PeriodeCollecte): boolean {
    return (
      this.dateDebut.getTime() === other.dateDebut.getTime() &&
      this.dateFin.getTime() === other.dateFin.getTime() &&
      this.dateFinSaisie.getTime() === other.dateFinSaisie.getTime()
    );
  }
}
