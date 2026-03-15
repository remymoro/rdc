export interface ParticipationMagasinDto {
  magasinId: string;
  statut: 'EN_ATTENTE' | 'CONFIRME' | 'REFUSE';
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
