import {SeatRowModel} from "./SeatRowModel";
import {ShowSeatModel} from "./ShowSeatModel";

export class SeatMatrix{

  arrangementId: string = '';
  arrangementType: string = '';
  seatRow: SeatRowModel[] = [];
  capacity: number = 0;
  showSeats: ShowSeatModel[] = [];
}
