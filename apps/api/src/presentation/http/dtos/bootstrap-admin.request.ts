import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class BootstrapAdminRequest {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(12)
  password!: string;
}
