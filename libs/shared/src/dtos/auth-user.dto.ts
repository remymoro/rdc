export interface AuthUserDto {
  id: string;
  email: string;
  role: 'ADMIN' | 'RESPONSABLE_CENTRE';
  centreId?: string;
}
