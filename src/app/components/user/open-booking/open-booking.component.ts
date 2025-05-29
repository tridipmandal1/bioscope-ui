import {Component, NgZone, OnInit} from '@angular/core';
import {CurrencyPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {ShowModel} from "../../../model/ShowModel";
import {UserService} from "../../../service/user.service";
import {AlertService} from "../../../service/alert.service";
import {TicketCategory} from "../../../model/TicketCategory";
import {UserNavComponent} from "../user-nav/user-nav.component";
import {RazorpayService} from "../../../service/razorpay.service";
import {PaymentVerification} from "../../../model/PaymentVerification";
import {environment} from "../../../../environments/environment";
import {MatProgressSpinner} from "@angular/material/progress-spinner";


@Component({
  selector: 'app-open-booking',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgIf,
    NgForOf,
    NgClass,
    UserNavComponent,
    MatProgressSpinner
  ],
  templateUrl: './open-booking.component.html',
  styleUrl: './open-booking.component.css'
})
export class OpenBookingComponent implements OnInit{

  isLoading: boolean = false;
  show: ShowModel = new ShowModel();
  quant= 0;


    ticketCategories: TicketCategory[] = [];


  selectedCategory: string = '';
  taxRate: number = 0.08;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private userService: UserService,
              private alertService: AlertService,
              private razorpayService: RazorpayService,
              private ngZone: NgZone) {
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
      this.quant = category.count;

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
      this.quant = category.count;

      // If no tickets left in this category, clear selected category
      if (category.count === 0 && this.selectedCategory === categoryId) {
        this.selectedCategory = '';
        this.quant = 0;
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

  // checkout(): void {
  //
  //  // Proceeding to checkout with the following order
  //   console.log('Selected tickets:', this.getSelectedCategories());
  //   console.log('Subtotal:', this.getSubtotal());
  //   console.log('Tax:', this.getTax());
  //   console.log('Total:', this.getTotal());
  //
  //   let category = this.selectedCategory.toUpperCase();
  //   console.log('Selected category:', category);
  //   console.log('Selected quantity:', this.quant);
  //   this.userService.bookEntryPass(this.show.showId, category, this.quant, this.getTotal()).subscribe({
  //     next: (response) => {
  //       console.log('Booking successful:', response);
  //       this.alertService.openAlert({
  //         isError:false, message: 'Booking successful check your ticket on profile'
  //       });
  //       this.router.navigate(['']).then(() =>{});
  //     },
  //     error: (error) => {
  //       console.error('Error booking entry pass:', error);
  //       this.alertService.openAlert({
  //         isError:true, message: error.err.message
  //       });
  //     }
  //   });
  //   //alert('Proceeding to checkout! Total: $' + this.getTotal().toFixed(2));
  // }

  checkout(): void {

    if(!this.userService.isAuthenticated()){
      this.router.navigate(['/join']).then(() => {});
      return;
    }
    if (!this.hasSelectedTickets()) {
      this.alertService.openAlert({ isError: true, message: 'Please select at least one ticket' });
      return;
    }

    const selectedCategory = this.ticketCategories.find(c => c.id === this.selectedCategory);
    if (!selectedCategory) {
      this.alertService.openAlert({ isError: true, message: 'No category selected' });
      return;
    }

    this.razorpayService.loadRazorpayScript().then(() => {
      this.userService.bookEntryPass(
        this.show.showId,
        selectedCategory.name.toUpperCase(),
        this.quant,
        this.getTotal()
      ).subscribe({
        next: (response) => {
          const ticket = response.body;
          console.log('Ticket or response of booking call', ticket)
          this.openRazorpayCheckout(ticket, ticket.id);
        },
        error: (error) => {
          console.error('Error initiating booking:', error);
          this.alertService.openAlert({ isError: true, message: 'Failed to initiate booking' });
        }
      });
    });
  }

  private openRazorpayCheckout(ticket: any, ticketId: string): void {
    const options = {
      key: environment.RAZOR_PAY_KEY_ID,
      amount: this.getTotal() * 100,
      currency: 'INR',
      name: 'Bioscope',
      description: 'Pass Booking Payment',
      order_id: ticket.orderId,
      handler: (paymentResponse: any) => {
        this.verifyPayment(paymentResponse, ticket.orderId, ticketId);
      },
      prefill: {
        name: this.userService.currentLoggedUser.name || 'Guest User',
        email: this.userService.currentLoggedUser.email || 'customer@example.com'
      },
      notes: {
        ticket_id: ticketId
      },
      theme: {
        color: '#3399cc'
      }

    };


    const rzp = new (window as any)['Razorpay'](options);
    rzp.on('payment.failed', (paymentResponse: any) => {
      this.alertService.openAlert({ isError: true, message: `Payment failed: ${paymentResponse.error.description}` });
      this.rollbackBooking(ticketId);
    });
    console.log('Razorpay options:', options);
    console.log('Razorpay instance:', rzp);
    rzp.open();
  }

  private verifyPayment(paymentResponse: any, orderId: string, ticketId: string): void {
    console.log('Payment response:', paymentResponse);
    const verificationRequest: PaymentVerification = {
      orderId: orderId,
      paymentId: paymentResponse.razorpay_payment_id,
      signature: paymentResponse.razorpay_signature,
      ticketId: ticketId
    };

    console.log(verificationRequest, 'verification req')
    this.isLoading = true;
    this.ngZone.run(() => {
      this.razorpayService.verifyPayment(verificationRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.alertService.openAlert({ isError: false,
            message: 'Payment done, check your profile after sometime' });
          this.router.navigate(['']).then(() => {});
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error verifying payment:', error);
          this.alertService.openAlert({ isError: true, message: 'Error verifying payment' });
          this.rollbackBooking(ticketId);
        },
        complete: () => {
          console.log('Payment verification completed');
        }
      });
    });

  }

  private rollbackBooking(ticketId: string): void {
    this.alertService.openAlert({ isError: true, message: 'Booking rolled back due to payment failure' });
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
