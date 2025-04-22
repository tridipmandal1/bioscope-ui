export class TicketCategory {
  constructor(id: string, category: string, s: string, price: number, number: number) {

    this.id = id;
    this.name = category;
    this.description = s;
    this.price = price;
    this.count = number;
  }

  id: string = '';
  name: string = '';
  description: string = '';
  price: number = 0;
  count: number = 0;
}
