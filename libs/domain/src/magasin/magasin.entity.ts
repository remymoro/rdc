import { MagasinId } from '../value-objects/magasin-id.vo';
import { CentreId } from '../value-objects/centre-id.vo';
import { Nom } from '../value-objects/nom.vo';
import { CodePostal } from '../value-objects/code-postal.vo';
import { Ville } from '../value-objects/ville.vo';
import { Adresse } from '../value-objects/adresse.vo';
import { Telephone } from '../value-objects/telephone.vo';
import { Email } from '../value-objects/email.vo';
import { DomainValidationException } from '../exceptions/domain-validation.exception';

export enum StatutMagasin {
  ACTIF = 'ACTIF',
  INACTIF = 'INACTIF',
  ARCHIVE = 'ARCHIVE',
}

export interface MagasinImage {
  id: string;
  url: string;
  ordre: number;
  createdAt: Date;
}

export interface MagasinProps {
  id: MagasinId;
  nom: Nom;
  ville: Ville;
  codePostal: CodePostal;
  adresse: Adresse;
  telephone?: Telephone;
  email?: Email;
  statut: StatutMagasin;
  centreId: CentreId;
  images: MagasinImage[];
  createdAt: Date;
  updatedAt: Date;
}

export class Magasin {
  private constructor(private readonly props: MagasinProps) {}

  static create(params: {
    id: string;
    nom: string;
    ville: string;
    codePostal: string;
    adresse: string;
    telephone?: string;
    email?: string;
    centreId: string;
  }): Magasin {
    return new Magasin({
      id: MagasinId.create(params.id),
      nom: Nom.create(params.nom),
      ville: Ville.create(params.ville),
      codePostal: CodePostal.create(params.codePostal),
      adresse: Adresse.create(params.adresse),
      telephone: params.telephone ? Telephone.create(params.telephone) : undefined,
      email: params.email ? Email.create(params.email) : undefined,
      statut: StatutMagasin.ACTIF,
      centreId: CentreId.create(params.centreId),
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstituer(props: MagasinProps): Magasin {
    return new Magasin(props);
  }

  get id(): MagasinId { return this.props.id; }
  get nom(): Nom { return this.props.nom; }
  get ville(): Ville { return this.props.ville; }
  get codePostal(): CodePostal { return this.props.codePostal; }
  get adresse(): Adresse { return this.props.adresse; }
  get telephone(): Telephone | undefined { return this.props.telephone; }
  get email(): Email | undefined { return this.props.email; }
  get statut(): StatutMagasin { return this.props.statut; }
  get centreId(): CentreId { return this.props.centreId; }
  get images(): MagasinImage[] { return [...this.props.images]; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  activer(): void {
    if (this.props.statut === StatutMagasin.ARCHIVE) {
      throw new DomainValidationException(
        'Un magasin archivé ne peut pas être réactivé',
        'MAGASIN_ARCHIVED',
      );
    }
    this.props.statut = StatutMagasin.ACTIF;
    this.props.updatedAt = new Date();
  }

  desactiver(): void {
    if (this.props.statut === StatutMagasin.ARCHIVE) {
      throw new DomainValidationException(
        'Un magasin archivé ne peut pas être désactivé',
        'MAGASIN_ARCHIVED',
      );
    }
    this.props.statut = StatutMagasin.INACTIF;
    this.props.updatedAt = new Date();
  }

  archiver(): void {
    this.props.statut = StatutMagasin.ARCHIVE;
    this.props.updatedAt = new Date();
  }

  modifier(params: {
    nom?: string;
    ville?: string;
    codePostal?: string;
    adresse?: string;
    telephone?: string | null;
    email?: string | null;
  }): void {
    if (this.props.statut === StatutMagasin.ARCHIVE) {
      throw new DomainValidationException(
        'Un magasin archivé ne peut pas être modifié',
        'MAGASIN_ARCHIVED',
      );
    }
    if (params.nom !== undefined) this.props.nom = Nom.create(params.nom);
    if (params.ville !== undefined) this.props.ville = Ville.create(params.ville);
    if (params.codePostal !== undefined) this.props.codePostal = CodePostal.create(params.codePostal);
    if (params.adresse !== undefined) this.props.adresse = Adresse.create(params.adresse);
    if (params.telephone !== undefined) {
      this.props.telephone = params.telephone ? Telephone.create(params.telephone) : undefined;
    }
    if (params.email !== undefined) {
      this.props.email = params.email ? Email.create(params.email) : undefined;
    }
    this.props.updatedAt = new Date();
  }

  estActif(): boolean {
    return this.props.statut === StatutMagasin.ACTIF;
  }
}
