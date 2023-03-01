import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDTO } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  private movies: Movie[] = [];

  getAll(): Movie[] {
    return this.movies;
  }

  getOne(_id: number): Movie {
    const movie: Movie = this.movies.find((movie) => movie.id === _id);
    if (!movie) {
      throw new NotFoundException(`Movie with ID: ${_id} not found`);
    }
    return movie;
  }

  search(_year: number): Movie[] {
    return this.movies.filter((movie) => movie.year === _year);
  }

  deleteOne(_id: number): boolean {
    this.getOne(_id);
    const length: number = this.movies.length;
    this.movies = this.movies.filter((movie) => movie.id !== _id);
    return length - this.movies.length === 1 ? true : false;
  }

  create(_movie: CreateMovieDTO): Movie {
    const newId = this.movies.length + 1;
    this.movies.push({
      id: newId,
      ..._movie,
    });
    return this.movies[newId - 1];
  }

  update(_id: number, _movie: UpdateMovieDto): Movie {
    const movie: Movie = this.getOne(_id);
    this.deleteOne(_id);
    this.movies.push({ ...movie, ..._movie });
    return this.movies[this.movies.length - 1];
  }
}
