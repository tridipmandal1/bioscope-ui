import {Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {User} from "../../../model/User";
import {TicketModel} from "../../../model/TicketModel";
import {UserService} from "../../../service/user.service";
import {AlertService} from "../../../service/alert.service";
import {AuthService} from "../../../service/auth.service";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {UserNavComponent} from "../user-nav/user-nav.component";
import html2canvas from "html2canvas";
import {tick} from "@angular/core/testing";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    UserNavComponent,
    MatProgressSpinner,
    DatePipe
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  isLoading: boolean = false;
  user: User = new User()
  tickets: TicketModel[] = [];

  constructor(private userService: UserService,
              private alertService: AlertService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe({
      next: (response) => {
        this.user = response.body;
        this.tickets = this.user.bookedTickets;
        console.log()
      },
      error: (error) => {
        console.error('Error fetching user profile', error);
      }
    })
  }

  cancelTicket(ticket: TicketModel): void {

    if (confirm('Are you sure you want to cancel this ticket?')) {
      this.isLoading = true;
      if(ticket.seats.length > 0){
        const ssIds: string[] = ticket.seats.map(seat => seat.ssid);
        this.userService.cancelMovieTicket(ticket.showId, ticket.id, ssIds).subscribe({
          next: (response) => {
            this.isLoading = false;
            this.alertService.openAlert({isError: false, message: 'Ticket cancelled successfully!' +
                ' Refund will be processed in 3-5 business days.'});
            this.tickets = this.tickets.filter(t => t.id !== ticket.id);
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Error cancelling ticket', error);
            this.alertService.openAlert({isError: true, message: 'Failed to cancel ticket'});
          }
        })
      } else {
        this.userService.cancelPass(ticket).subscribe({
          next: (response) => {
            this.isLoading = false;
            this.alertService.openAlert({isError: false, message: 'Ticket cancelled successfully!' +
            ' Refund will be processed in 3-5 business days.'});
            this.tickets = this.tickets.filter(t => t.id !== ticket.id);
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Error cancelling ticket', error);
            this.alertService.openAlert({isError: true, message: 'Failed to cancel ticket'});
          }
        })
      }
    }
  }

  @ViewChildren('ticketCard') ticketCards!: QueryList<ElementRef>;

  downloadTicket(ticket: TicketModel, event: Event): void {
    event.stopPropagation();

    // Find the parent ticket card element
    const buttonElement = event.target as HTMLElement;
    const cardElement = buttonElement.closest('.ticket-card') as HTMLElement;

    if (!cardElement) {
      console.error('Could not find ticket card element');
      return;
    }

    // Create a clone of the card to modify for screenshot
    const clonedCard = cardElement.cloneNode(true) as HTMLElement;

    // Remove buttons from the clone
    const downloadBtnClone = clonedCard.querySelector('.download-btn');
    const cancelBtnClone = clonedCard.querySelector('.cancel-btn');

    if (downloadBtnClone) downloadBtnClone.remove();
    if (cancelBtnClone) cancelBtnClone.remove();

    // Apply the same styles but position off-screen
    clonedCard.style.position = 'absolute';
    clonedCard.style.left = '-9999px';
    clonedCard.style.top = '0';
    clonedCard.style.width = cardElement.offsetWidth + 'px';
    clonedCard.style.height = 'auto';
    clonedCard.style.background = 'white';
    clonedCard.style.padding = '20px';

    // Add to body temporarily
    document.body.appendChild(clonedCard);

    // Handle QR code image in the clone
    const qrCodeImg = clonedCard.querySelector('.qr-code img') as HTMLImageElement;
    if (qrCodeImg) {
      // Create a new image with crossOrigin attribute
      const newImg = new Image();
      newImg.crossOrigin = 'anonymous';
      newImg.src = ticket.qrCode;

      // Replace the original image
      // if (qrCodeImg.parentNode) {
      //   newImg.className = qrCodeImg.className;
      //   newImg.alt = 'QR Code';
      //   newImg.style.width = '100%';
      //   qrCodeImg.parentNode.replaceChild(newImg, qrCodeImg);
      // }
    }

    // Wait a bit to ensure images are loaded
    setTimeout(() => {
      html2canvas(clonedCard, {
        backgroundColor: 'white',
        scale: 2,
        logging: true, // Enable logging to debug
        useCORS: true,
        allowTaint: true,
        onclone: (clonedDoc) => {
          // Additional modifications to the cloned document if needed
          const clonedElement = clonedDoc.querySelector('.ticket-card') as HTMLElement;
          if (clonedElement) {
            clonedElement.style.boxShadow = 'none'; // Remove shadow for cleaner image
          }
        }
      }).then(canvas => {
        // Convert canvas to image data URL
        const imageData = canvas.toDataURL('image/png');

        // Create download link
        const link = document.createElement('a');
        link.href = imageData;
        link.download = `ticket-${ticket.showName.replace(/\s+/g, '-').toLowerCase()}-${ticket.id}.png`;

        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up - remove the cloned element
        document.body.removeChild(clonedCard);

      }).catch(error => {
        console.error('Error generating ticket image:', error);
        document.body.removeChild(clonedCard);
      });
    }, 500); // Give 500ms for everything to render properly
  }
  protected readonly localStorage = localStorage;

}
