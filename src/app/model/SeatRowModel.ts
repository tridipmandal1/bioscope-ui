import {SeatModel} from "./SeatModel";

export class SeatRowModel{

  rowId: string = '';
  rowIndex: string = '';
  seatCategory: string = '';
  passageAfterwards: number[] = [];
  seats: SeatModel[] = [];
}
