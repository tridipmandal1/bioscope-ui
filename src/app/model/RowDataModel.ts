export class RowDataModel {
  rowIndex: string = '';
  seatsInRow: number = 0;
  priceInRow: number = 0;
  passageFollowed: number[] = []; // have to multiple numbers as input and this should have a tooltip
  category: string = ''; // dropdown REGULAR, PREMIUM, VIP
}
