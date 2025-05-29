import {ShowSeatModel} from "./ShowSeatModel";

export class TicketModel {
  id: string = '';
  hostId: string = '';
  showName: string = '';
  showId: string = '';
  date: string = '';
  startTime: string = '';
  category: string = '';
  allowedPersons: number = 0;
  seats: ShowSeatModel[] = [];
  qrCode: string = '';
  orderId: string = '';
  paymentId: string = '';
  paymentStatus: string = '';
  amount: number = 0;

}
