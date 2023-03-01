import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateMovieDTO {
  @IsString()
  readonly title: string;
  @IsNumber()
  readonly year: number;

  @IsOptional() // Checks if value is missing and if so, ignores all validators.
  @IsString({ each: true }) // each: Specifies if validated value is an array and each of its items must be validated.
  readonly genres: string[];
}
