import {Movie} from "./Movie";
import {ShowSeatModel} from "./ShowSeatModel";
import {PassPrice} from "./PassPrice";

export class ShowModel{
  showId: string = ''; // hidden field
  showName: string = '';
  movie: Movie = new Movie(); // select from dropdown
  hostName: string = '';
  showType: string = ''; // select from dropdown
  poster: string = ''; // image upload
  arrangementType: string = ''; // dropdown STANDING or SITTING
  capacity: number = 0;
  reserved: number = 0; // not needed
  location: string = ''; // geolocation fetch
  screenId: string = ''; // select from dropdown
  showDescription: string = '';
  showSeats: ShowSeatModel[] = []; // array of seats
  showDate: string = ''; // YYYY-MM-DD date picker
  showTime: string = ''; // HH:mm time picker
  showDuration: string  = ''; // PT1H30M formated
  ticketPrice: PassPrice[] = []; // array of prices
}
