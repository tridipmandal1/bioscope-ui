import {Component, Input, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";

interface SeatId {
  seatNumber: string;
}

interface Seat {
  id: SeatId;
  price: number;
  isBooked?: boolean;
}

interface SeatRow {
  rowIndex: string;
  seatCategory: string;
  seats: Seat[];
  passageAfterwards: number[];
}

interface SeatMatrix {
  seatRow: SeatRow[];
}
@Component({
  selector: 'app-show-seating',
  standalone: true,
  imports: [
    NgClass,
    NgForOf,
    NgIf
  ],
  templateUrl: './show-seating.component.html',
  styleUrl: './show-seating.component.css'
})
export class ShowSeatingComponent implements OnInit{

  @Input() movieName: string = 'Avengers: Endgame';
  @Input() hallName: string = 'PVR Cinemas';
  @Input() showTime: string = '7:30 PM';
  @Input() seatMatrix: SeatMatrix = { seatRow: [] };

  selectedSeats: Seat[] = [];
  totalAmount: number = 0;

  constructor() { }

  ngOnInit(): void {
    // Initialize with some sample data if needed
  }

  getPassagesAtIndex(passages: number[], index: number): number[] {
    if (!passages || !passages.includes(index)) {
      return [];
    }
    return [1]; // Return an array with one element to render one passage
  }

  toggleSeatSelection(seat: Seat): void {
    if (seat.isBooked) {
      return; // Cannot select already booked seats
    }

    const index = this.selectedSeats.findIndex(s =>
      s.id.seatNumber === seat.id.seatNumber);

    if (index === -1) {
      // Add seat to selection
      this.selectedSeats.push(seat);
      this.totalAmount += seat.price;
    } else {
      // Remove seat from selection
      this.selectedSeats.splice(index, 1);
      this.totalAmount -= seat.price;
    }
  }

  isSeatSelected(seat: Seat): boolean {
    return this.selectedSeats.some(s => s.id.seatNumber === seat.id.seatNumber);
  }

  confirmSelection(): void {
    console.log('Selected seats:', this.selectedSeats);
    console.log('Total amount:', this.totalAmount);
    // Here you would typically call a service to book the seats
  }

}
