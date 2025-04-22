import {SeatMatrix} from "./SeatMatrix";
import {ShowModel} from "./ShowModel";

export class Screen {
  screenId: string = '';
  screenName: string = '';
  seatingArrangement: SeatMatrix = new SeatMatrix();
  currentShows: ShowModel[] = [];
}
