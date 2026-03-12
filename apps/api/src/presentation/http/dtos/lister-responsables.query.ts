import { IsBooleanString, IsOptional, IsUUID } from 'class-validator';

export class ListerResponsablesQuery {
  @IsOptional()
  @IsUUID('4')
  centreId?: string;

  @IsOptional()
  @IsBooleanString()
  isActive?: string;
}
