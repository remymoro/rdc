import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsPostalCode,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreerCentreRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nom!: string;

  @IsString()
  @IsNotEmpty()
  ville!: string;

  @IsPostalCode('FR')
  codePostal!: string;

  @IsString()
  @IsNotEmpty()
  adresse!: string;

  @IsOptional()
  @IsPhoneNumber('FR')
  telephone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
