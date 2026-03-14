import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsPostalCode,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreerMagasinRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nom!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  ville!: string;

  @IsString()
  @IsNotEmpty()
  @IsPostalCode('FR')
  codePostal!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  adresse!: string;

  @IsOptional()
  @IsPhoneNumber('FR')
  telephone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}