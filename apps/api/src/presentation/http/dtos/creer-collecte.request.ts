import { IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreerCollecteRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nom!: string;

  @IsDateString()
  dateDebut!: string;

  @IsDateString()
  dateFin!: string;

  @IsDateString()
  dateFinSaisie!: string;
}
