import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsPostalCode,
  IsString,
  MaxLength,
} from 'class-validator';

export class ModifierCentreRequest {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nom?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  ville?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsPostalCode('FR')
  codePostal?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  adresse?: string;

  @IsOptional()
  @IsPhoneNumber('FR')
  telephone?: string | null;

  @IsOptional()
  @IsEmail()
  email?: string | null;
}
