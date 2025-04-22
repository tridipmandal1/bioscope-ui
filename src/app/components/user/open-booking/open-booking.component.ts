import {Component, OnInit} from '@angular/core';
import {CurrencyPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {ShowModel} from "../../../model/ShowModel";
import {UserService} from "../../../service/user.service";
import {AlertService} from "../../../service/alert.service";
import {TicketCategory} from "../../../model/TicketCategory";


@Component({
  selector: 'app-open-booking',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgIf,
    NgForOf,
    NgClass
  ],
  templateUrl: './open-booking.component.html',
  styleUrl: './open-booking.component.css'
})
export class OpenBookingComponent implements OnInit{

  show: ShowModel = new ShowModel();


    ticketCategories: TicketCategory[] = [];


  selectedCategory: string = '';
  taxRate: number = 0.08; // 8% tax rate

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private userService: UserService,
              private alertService: AlertService) {
    this.ticketCategories = this.show.ticketPrice.map(tp =>
      new TicketCategory(tp.id, tp.category, '', tp.price, 0)
    );
  }

  ngOnInit(): void {
    console.log(this.ticketCategories);
      let id = this.activatedRoute.snapshot.paramMap.get('id');
      if (id) {
        id = decodeURIComponent(id);
        this.userService.getShow(id).subscribe({
          next: (response) => {
            this.show = response.body;
            this.show.showDuration = this.parseISODuration(this.show.showDuration);
            this.ticketCategories = this.show.ticketPrice.map(tp =>
              new TicketCategory(tp.id, tp.category, '', tp.price, 0)
            );
          },
          error: (error) => {
            console.error('Error fetching show details:', error);
          }
        })
      }
    console.log(id);
  }

  incrementTicket(categoryId: string): void {
    const category = this.ticketCategories.find(c => c.id === categoryId);
    if (category && category.count < 5) {
      category.count++;

      // If this is the first ticket selected, set as selected category
      if (this.selectedCategory === '' && category.count === 1) {
        this.selectedCategory = categoryId;
      }
    }
  }

  decrementTicket(categoryId: string): void {
    const category = this.ticketCategories.find(c => c.id === categoryId);
    if (category && category.count > 0) {
      category.count--;

      // If no tickets left in this category, clear selected category
      if (category.count === 0 && this.selectedCategory === categoryId) {
        this.selectedCategory = '';
      }
    }
  }

  selectCategory(categoryId: string): void {
    // If selecting a different category, reset all counts
    if (this.selectedCategory !== '' && this.selectedCategory !== categoryId) {
      this.ticketCategories.forEach(c => {
        if (c.id === this.selectedCategory) {
          c.count = 0;
        }
      });
    }

    this.selectedCategory = categoryId;

    // If the selected category has no tickets, add one
    const category = this.ticketCategories.find(c => c.id === categoryId);
    if (category && category.count === 0) {
      category.count = 1;
    }
  }

  hasSelectedTickets(): boolean {
    return this.ticketCategories.some(c => c.count > 0);
  }

  getSelectedCategories(): TicketCategory[] {
    return this.ticketCategories.filter(c => c.count > 0);
  }

  getSubtotal(): number {
    return this.ticketCategories.reduce((sum, category) => {
      return sum + (category.price * category.count);
    }, 0);
  }

  getTax(): number {
    return this.getSubtotal() * this.taxRate;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getTax();
  }

  isLastCategory(categoryId: string): boolean {
    const lastCategory = this.ticketCategories[this.ticketCategories.length - 1];
    return lastCategory.id === categoryId;
  }

  checkout(): void {
    // In a real application, this would navigate to checkout or process payment
    console.log('Proceeding to checkout with the following order:');
    console.log('Selected tickets:', this.getSelectedCategories());
    console.log('Subtotal:', this.getSubtotal());
    console.log('Tax:', this.getTax());
    console.log('Total:', this.getTotal());

    alert('Proceeding to checkout! Total: $' + this.getTotal().toFixed(2));
  }

  parseISODuration(duration: string): string {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const match = duration.match(regex);

    if (!match) {
      throw new Error("Invalid ISO 8601 duration format");
    }

    const hours = match[1] ? match[1].padStart(2, '0') : '00';
    const minutes = match[2] ? match[2].padStart(2, '0') : '00';

    return `${hours}:${minutes}`;
  }
}
