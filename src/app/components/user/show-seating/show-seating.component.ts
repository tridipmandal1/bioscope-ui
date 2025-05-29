import {Component, Input, NgZone, OnInit} from '@angular/core';
import {CurrencyPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {SeatMatrix} from "../../../model/SeatMatrix";
import {UserService} from "../../../service/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ShowSeatModel} from "../../../model/ShowSeatModel";
import {ShowModel} from "../../../model/ShowModel";
import {SeatModel} from "../../../model/SeatModel";
import {SeatId} from "../../../model/SeatId";
import {UserNavComponent} from "../user-nav/user-nav.component";
import {AlertService} from "../../../service/alert.service";
import {RazorpayService} from "../../../service/razorpay.service";
import {environment} from "../../../../environments/environment";
import {PaymentVerification} from "../../../model/PaymentVerification";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-show-seating',
  standalone: true,
  imports: [
    NgClass,
    NgForOf,
    NgIf,
    UserNavComponent,
    MatProgressSpinner,
    CurrencyPipe
  ],
  templateUrl: './show-seating.component.html',
  styleUrl: './show-seating.component.css'
})
export class ShowSeatingComponent implements OnInit{


   seatMatrix: SeatMatrix = new SeatMatrix();
   show: ShowModel = new ShowModel();
   showSeats: ShowSeatModel[] = [];
   books: string[] = [];
   isLoading: boolean = false;
   taxRate = 0.08;
   platformCharge = 0.01;


  selectedSeats: ShowSeatModel[] = [];
  totalAmount: number = 0;

  constructor(private userService: UserService,
              private router: Router,
              private actRoute: ActivatedRoute,
              private alertService: AlertService,
              private razorpayService: RazorpayService,
               private ngZone: NgZone) { }

  ngOnInit(): void {
    let showId = this.actRoute.snapshot.params['id'];
    this.userService.getSeatMatrixOfShow(showId).subscribe({
      next: (data) => {
        this.seatMatrix = data.body;
        this.showSeats = this.seatMatrix.showSeats;
        console.log(this.seatMatrix);
        this.userService.getShow(showId).subscribe({
          next: (data) => {
            this.show = data.body;
            console.log(this.show);
          },
          error: (error) => {
            console.error('Error fetching show details:', error);
          }
        })
      },
      error: (error) => {
        console.error('Error fetching seat matrix:', error);
      }
    })
  }

  getPassagesAtIndex(passages: number[], index: number): number[] {
    if (!passages || !passages.includes(index)) {
      return [];
    }
    return [1]; // Return an array with one element to render one passage
  }

  // toggleSeatSelection(seat: SeatModel): void {
  //   if (this.isBooked(seat)) {
  //     return; // Cannot select already booked seats
  //   }
  //
  //   const index = this.selectedSeats.findIndex(s =>
  //     s.seatId.seatNumber === seat.id.seatNumber);
  //
  //   if (index === -1) {
  //     // Add seat to selection
  //     let sSH = this.showSeats
  //       .find(s => this.seatIdMatcher(s.seatId,seat.id));
  //     if (!sSH) {
  //       console.error('Seat not found in show seats');
  //       return;
  //     }
  //     console.log('ssh', sSH);
  //     console.log(sSH.sSId);
  //     this.books.push(sSH.sSId);
  //     this.selectedSeats.push(sSH);
  //     this.totalAmount += seat.price;
  //   } else {
  //     // Remove seat from selection
  //     this.selectedSeats.splice(index, 1);
  //     this.totalAmount -= seat.price;
  //   }
  // }

  toggleSeatSelection(seat: SeatModel): void {
    if (this.isBooked(seat)) {
      return; // Cannot select already booked seats
    }

    const index = this.selectedSeats.findIndex(s =>
      s.seatId.seatNumber === seat.id.seatNumber);

    if (index === -1) {
      // Add seat to selection
      let sSH = this.showSeats.find(s => this.seatIdMatcher(s.seatId, seat.id));
      if (!sSH) {
        console.error('Seat not found in show seats');
        return;
      }
      console.log('ssh', JSON.stringify(sSH, null, 2));
      console.log('ssId', sSH.ssid); // Use correct property name
      if (sSH.ssid === undefined) {
        console.error('ssId is undefined. Check data source.');
        return;
      }
      this.books.push(sSH.ssid);
      this.selectedSeats.push(sSH);
      this.totalAmount += seat.price;
    } else {
      // Remove seat from selection
      this.selectedSeats.splice(index, 1);
      this.totalAmount -= seat.price;
    }
  }

  isBooked(seat: SeatModel): boolean {
    let currentSs
      = this.showSeats.find(s => this.seatIdMatcher(s.seatId,seat.id));
    return currentSs?.seatStatus === 'BOOKED';
  }
  isSeatSelected(seat: SeatModel): boolean {
    return this.selectedSeats.some(s => this.seatIdMatcher(s.seatId,seat.id));
  }

  // confirmSelection(): void {
  //   console.log('Selected seats:', this.selectedSeats);
  //   console.log('Total amount:', this.totalAmount);
  //   let v: string[] = this.selectedSeats.map(seat => `${seat.ssid}`);
  //   console.log('Selected seat ids:', v);
  //   this.userService.bookMovieTicket(this.show.showId, v, this.totalAmount).subscribe({
  //     next: (response) => {
  //       console.log('Booking successful:', response);
  //
  //       this.alertService.openAlert({isError:false,
  //         message: 'Booking successful check your ticket on profile after sometime'});
  //       this.router.navigate(['']).then(() => {});
  //     },
  //     error: (error) => {
  //       console.error('Error booking tickets:', error);
  //     }
  //   })
  // }

  confirmSelection(): void {
    if(!this.userService.isAuthenticated()){
      this.router.navigate(['/join']).then(() => {});
      return;
    }
    if (this.selectedSeats.length === 0) {
      this.alertService.openAlert({ isError: true, message: 'Please select at least one seat' });
      return;
    }

    console.log('Selected seat IDs:', this.books);
    this.razorpayService.loadRazorpayScript().then(() => {
      this.userService.bookMovieTicket(this.show.showId, this.books, this.getTotal()).subscribe({
        next: (response) => {
          const ticket = response.body;
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
      amount: this.getTotal() * 100, // Convert to paise
      currency: 'INR',
      name: 'Bioscope',
      description: 'Seat Booking Payment',
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
    rzp.open();
  }

  private verifyPayment(paymentResponse: any, orderId: string, ticketId: string): void {
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
            this.alertService.openAlert({
              isError: false,
              message: 'Booking confirmed successfully! Check your ticket in profile.'
            });
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

  getTotal(): number {
    return this.getSubTotal() - this.getTax();
  }
  getSubTotal(): number{
    return this.totalAmount;
  }
  getTax(): number {
      return this.getSubTotal() * this.taxRate;
  }
  private rollbackBooking(ticketId: string): void {
    // Optional: Notify backend to rollback if needed
    this.alertService.openAlert({ isError: true, message: 'Booking rolled back due to payment failure' });
  }
  private seatIdMatcher(id1: SeatId, id2: SeatId): boolean {
   return id1.seatingArrangementId === id2.seatingArrangementId &&
     id1.rowIndex === id2.rowIndex &&
     id1.seatNumber === id2.seatNumber;

  }
}
