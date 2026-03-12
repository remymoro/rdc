export interface AuthTokenDto {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
}
