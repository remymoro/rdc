import { CollecteId } from '../value-objects/collecte-id.vo';
import { MagasinId } from '../value-objects/magasin-id.vo';
import { Nom } from '../value-objects/nom.vo';
import { PeriodeCollecte } from '../value-objects/periode-collecte.vo';
import { DomainValidationException } from '../exceptions/domain-validation.exception';

export enum StatutCollecte {
  PREPARATION          = 'PREPARATION',
  INSCRIPTIONS_OUVERTES = 'INSCRIPTIONS_OUVERTES',
  INSCRIPTIONS_FERMEES  = 'INSCRIPTIONS_FERMEES',
  EN_COURS             = 'EN_COURS',
  SAISIE_EN_COURS      = 'SAISIE_EN_COURS',
  TERMINEE             = 'TERMINEE',
}

export enum StatutParticipation {
  EN_ATTENTE = 'EN_ATTENTE',
  CONFIRME   = 'CONFIRME',
  REFUSE     = 'REFUSE',
}

export interface ParticipationMagasin {
  magasinId: MagasinId;
  statut: StatutParticipation;
}

export interface CollecteProps {
  id: CollecteId;
  nom: Nom;
  periode: PeriodeCollecte;
  statut: StatutCollecte;
  participations: ParticipationMagasin[];
  createdAt: Date;
  updatedAt: Date;
}

export class Collecte {
  private constructor(private readonly props: CollecteProps) {}

  static create(params: {
    id: string;
    nom: string;
    dateDebut: Date;
    dateFin: Date;
    dateFinSaisie: Date;
  }): Collecte {
    return new Collecte({
      id: CollecteId.create(params.id),
      nom: Nom.create(params.nom),
      periode: PeriodeCollecte.create(params.dateDebut, params.dateFin, params.dateFinSaisie),
      statut: StatutCollecte.PREPARATION,
      participations: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstituer(props: CollecteProps): Collecte {
    return new Collecte(props);
  }

  get id(): CollecteId { return this.props.id; }
  get nom(): Nom { return this.props.nom; }
  get periode(): PeriodeCollecte { return this.props.periode; }
  get statut(): StatutCollecte { return this.props.statut; }
  get participations(): ParticipationMagasin[] { return [...this.props.participations]; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  // --- Cycle de vie ---

  ouvrirInscriptions(): void {
    if (this.props.statut !== StatutCollecte.PREPARATION) {
      throw new DomainValidationException(
        'Les inscriptions ne peuvent être ouvertes que depuis le statut PREPARATION',
        'COLLECTE_STATUT_INVALIDE',
      );
    }
    this.props.statut = StatutCollecte.INSCRIPTIONS_OUVERTES;
    this.props.updatedAt = new Date();
  }

  fermerInscriptions(): void {
    if (this.props.statut !== StatutCollecte.INSCRIPTIONS_OUVERTES) {
      throw new DomainValidationException(
        'Les inscriptions ne peuvent être fermées que depuis le statut INSCRIPTIONS_OUVERTES',
        'COLLECTE_STATUT_INVALIDE',
      );
    }
    this.props.statut = StatutCollecte.INSCRIPTIONS_FERMEES;
    this.props.updatedAt = new Date();
  }

  demarrer(): void {
    if (this.props.statut !== StatutCollecte.INSCRIPTIONS_FERMEES) {
      throw new DomainValidationException(
        'La collecte ne peut démarrer que depuis le statut INSCRIPTIONS_FERMEES',
        'COLLECTE_STATUT_INVALIDE',
      );
    }
    this.props.statut = StatutCollecte.EN_COURS;
    this.props.updatedAt = new Date();
  }

  ouvrirSaisie(): void {
    if (this.props.statut !== StatutCollecte.EN_COURS) {
      throw new DomainValidationException(
        'La saisie ne peut être ouverte que depuis le statut EN_COURS',
        'COLLECTE_STATUT_INVALIDE',
      );
    }
    this.props.statut = StatutCollecte.SAISIE_EN_COURS;
    this.props.updatedAt = new Date();
  }

  terminer(): void {
    if (this.props.statut !== StatutCollecte.SAISIE_EN_COURS) {
      throw new DomainValidationException(
        'La collecte ne peut être terminée que depuis le statut SAISIE_EN_COURS',
        'COLLECTE_STATUT_INVALIDE',
      );
    }
    this.props.statut = StatutCollecte.TERMINEE;
    this.props.updatedAt = new Date();
  }

  // --- Gestion des participations ---

  ajouterMagasin(magasinId: MagasinId): void {
    if (this.props.statut !== StatutCollecte.PREPARATION) {
      throw new DomainValidationException(
        'Les magasins ne peuvent être ajoutés qu\'en phase de PREPARATION',
        'COLLECTE_STATUT_INVALIDE',
      );
    }
    const existe = this.props.participations.some(p => p.magasinId.equals(magasinId));
    if (existe) return;
    this.props.participations.push({ magasinId, statut: StatutParticipation.EN_ATTENTE });
    this.props.updatedAt = new Date();
  }

  confirmerMagasin(magasinId: MagasinId): void {
    const participation = this.trouverParticipation(magasinId);
    participation.statut = StatutParticipation.CONFIRME;
    this.props.updatedAt = new Date();
  }

  refuserMagasin(magasinId: MagasinId): void {
    const participation = this.trouverParticipation(magasinId);
    participation.statut = StatutParticipation.REFUSE;
    this.props.updatedAt = new Date();
  }

  // --- Requêtes ---

  estOuverteAuxInscriptions(): boolean {
    return this.props.statut === StatutCollecte.INSCRIPTIONS_OUVERTES;
  }

  estTerminee(): boolean {
    return this.props.statut === StatutCollecte.TERMINEE;
  }

  magasinEstConfirme(magasinId: MagasinId): boolean {
    return this.props.participations.some(
      p => p.magasinId.equals(magasinId) && p.statut === StatutParticipation.CONFIRME,
    );
  }

  // --- Privé ---

  private trouverParticipation(magasinId: MagasinId): ParticipationMagasin {
    const participation = this.props.participations.find(p => p.magasinId.equals(magasinId));
    if (!participation) {
      throw new DomainValidationException(
        'Ce magasin ne fait pas partie de la collecte',
        'MAGASIN_NON_INSCRIT',
      );
    }
    return participation;
  }
}
