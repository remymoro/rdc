export interface ResponsableCentreDto {
  id: string;
  email: string;
  role: 'RESPONSABLE_CENTRE';
  centreId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
