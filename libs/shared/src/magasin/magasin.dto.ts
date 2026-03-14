export interface MagasinImageDto {
  id: string;
  url: string;
  ordre: number;
  createdAt: Date;
}

export interface MagasinDto {
  id: string;
  nom: string;
  ville: string;
  codePostal: string;
  adresse: string;
  telephone?: string;
  email?: string;
  statut: 'ACTIF' | 'INACTIF' | 'ARCHIVE';
  centreId: string;
  images: MagasinImageDto[];
  createdAt: Date;
  updatedAt: Date;
}
