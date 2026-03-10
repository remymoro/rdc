import { CentreId } from '../value-objects/centre-id.vo';
import { Nom } from '../value-objects/nom.vo';
import { CodePostal } from '../value-objects/code-postal.vo';

export enum StatutCentre {
  ACTIF = 'ACTIF',
  INACTIF = 'INACTIF',
  ARCHIVE = 'ARCHIVE',
}

export interface CentreProps {
  id: CentreId;
  nom: Nom;
  ville: string;
  codePostal: CodePostal;
  adresse: string;
  telephone?: string;
  email?: string;
  statut: StatutCentre;
  createdAt: Date;
  updatedAt: Date;
}

export class Centre {
  private constructor(private readonly props: CentreProps) {}

  // Factory method
  static create(params: {
    id: string;
    nom: string;
    ville: string;
    codePostal: string;
    adresse: string;
    telephone?: string;
    email?: string;
  }): Centre {
    return new Centre({
      id: CentreId.create(params.id),
      nom: Nom.create(params.nom),
      ville: params.ville.trim(),
      codePostal: CodePostal.create(params.codePostal),
      adresse: params.adresse.trim(),
      telephone: params.telephone,
      email: params.email,
      statut: StatutCentre.ACTIF,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Reconstitution depuis la BDD
  static reconstituer(props: CentreProps): Centre {
    return new Centre(props);
  }

  // Getters
  get id(): CentreId { return this.props.id; }
  get nom(): Nom { return this.props.nom; }
  get ville(): string { return this.props.ville; }
  get codePostal(): CodePostal { return this.props.codePostal; }
  get adresse(): string { return this.props.adresse; }
  get telephone(): string | undefined { return this.props.telephone; }
  get email(): string | undefined { return this.props.email; }
  get statut(): StatutCentre { return this.props.statut; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  // Comportements métier
  activer(): void {
    this.props.statut = StatutCentre.ACTIF;
    this.props.updatedAt = new Date();
  }

  desactiver(): void {
    this.props.statut = StatutCentre.INACTIF;
    this.props.updatedAt = new Date();
  }

  archiver(): void {
    this.props.statut = StatutCentre.ARCHIVE;
    this.props.updatedAt = new Date();
  }

  estActif(): boolean {
    return this.props.statut === StatutCentre.ACTIF;
  }
}
