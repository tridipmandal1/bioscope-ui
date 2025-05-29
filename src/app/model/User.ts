import {ShowModel} from "./ShowModel";
import {Movie} from "./Movie";

export class User {
  userId: string = 'Guest';
  email: string = '';
  role: string = '';
  name: string = '';
  location: string = '';
   interests: string[] = [];
  shows: ShowModel[] = [];
  screens: Screen[] = [];
   watchedMovies: any = null;
   bookedTickets: any = null;
}
