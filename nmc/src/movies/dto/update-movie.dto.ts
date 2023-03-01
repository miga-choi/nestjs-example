import { IsString, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDTO } from './create-movie.dto';

export class UpdateMovieDto extends PartialType(CreateMovieDTO) {
  // @IsString()
  // readonly title?: string; // '?' means not must required
  // @IsNumber()
  // readonly year?: number;
  // @IsString({ each: true }) // each: Specifies if validated value is an array and each of its items must be validated.
  // readonly genres?: string[];
}
