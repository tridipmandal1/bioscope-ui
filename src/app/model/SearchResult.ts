import {ShowModel} from "./ShowModel";
import {Movie} from "./Movie";
import {User} from "./User";

export class SearchResult{
  shows: ShowModel[] = [];
  movies: Movie[] = [];
  hosts: User[] = [];
  message: string = '';
}
