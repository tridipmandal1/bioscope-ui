
export class SeatId {
  seatingArrangementId: any; // hidden
  rowIndex: string = '';
  seatNumber: number = 0;

  equals(other: SeatId): boolean {
    return (
      this.seatingArrangementId === other.seatingArrangementId &&
      this.rowIndex === other.rowIndex &&
      this.seatNumber === other.seatNumber
    );
  }
}
