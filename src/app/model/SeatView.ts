import {SeatId} from "./SeatId";

export class SeatView {
  showName: string = '';
  showDate: string = '';
  showTime: string = '';
  seatId: SeatId = new SeatId();
  category: string = '';
  allowedPersons: number = 0;
}
