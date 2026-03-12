import { IsEmail, IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class CreerResponsableRequest {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(12)
  password!: string;

  @IsUUID('4')
  centreId!: string;
}
