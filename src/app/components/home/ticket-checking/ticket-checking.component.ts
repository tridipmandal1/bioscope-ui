import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {ManagementService} from "../../../service/management.service";
import {SeatView} from "../../../model/SeatView";
import {AlertService} from "../../../service/alert.service";

@Component({
  selector: 'app-ticket-checking',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './ticket-checking.component.html',
  styleUrl: './ticket-checking.component.css'
})
export class TicketCheckingComponent implements OnInit{

  isScanning: boolean = false;
  seats: SeatView[] = [];
constructor(private managementService: ManagementService,
            private alertService: AlertService) {
}
  selectedFile: File | null = null;

  ngOnInit() {
    this.isScanning = true;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

    }
  }

  uploadImage(): void {
    if (!this.selectedFile) return;
    this.managementService.verifyPass(this.selectedFile).subscribe({
      next: (response) => {
        this.isScanning = false;
        this.seats = response;
        console.log(response);
      },
      error: (error) => {
        this.alertService.openAlert({isError: true, message: error.error.message});
      }
    })
  }
}
