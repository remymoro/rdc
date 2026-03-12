import { IsBoolean, IsEmail, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class ModifierResponsableRequest {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(12)
  password?: string;

  @IsOptional()
  @IsUUID('4')
  centreId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
