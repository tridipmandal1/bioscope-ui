import {MovieReview} from "./MovieReview";

export class Movie {
  movieId: string = '';
  title: string = '';
  description: string = '';
  genres: string[] = [];
  duration: string = '';
  rating: string = '';
  language: string = '';
  poster: string = '';
  releaseDate: string = '';
  trailerUrl: string = '';
  casts: string = '';
  reviews: MovieReview[] = [];
  isCurrentlyStreaming: boolean = false;
}
