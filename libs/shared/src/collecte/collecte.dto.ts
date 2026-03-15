export interface ParticipationMagasinDto {
  magasinId: string;
  statut: 'EN_ATTENTE' | 'CONFIRME' | 'REFUSE';
}

export interface MagasinParticipantDto {
  magasinId: string;
  nom: string;
  adresse: string;
  ville: string;
  codePostal: string;
  telephone?: string;
  email?: string;
  images: { id: string; url: string; ordre: number }[];
  statutParticipation: 'EN_ATTENTE' | 'CONFIRME' | 'REFUSE';
}

export interface CollecteParticipationCentreDto {
  collecteId: string;
  nom: string;
  annee: number;
  statut: 'PREPARATION' | 'INSCRIPTIONS_OUVERTES' | 'INSCRIPTIONS_FERMEES' | 'EN_COURS' | 'SAISIE_EN_COURS' | 'TERMINEE';
  dateDebut: Date;
  dateFin: Date;
  dateFinSaisie: Date;
  magasins: MagasinParticipantDto[];
}

export interface CollecteDto {
  id: string;
  nom: string;
  dateDebut: Date;
  dateFin: Date;
  dateFinSaisie: Date;
  annee: number;
  statut: 'PREPARATION' | 'INSCRIPTIONS_OUVERTES' | 'INSCRIPTIONS_FERMEES' | 'EN_COURS' | 'SAISIE_EN_COURS' | 'TERMINEE';
  participations: ParticipationMagasinDto[];
  createdAt: Date;
  updatedAt: Date;
}
