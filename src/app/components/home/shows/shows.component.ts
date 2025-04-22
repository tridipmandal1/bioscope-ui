import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {ShowModel} from "../../../model/ShowModel";
import {ManagementService} from "../../../service/management.service";
import {MapToArrayPipe} from "../../../pipes/map-to-array.pipe";
import {Router} from "@angular/router";
import {AlertService} from "../../../service/alert.service";

@Component({
  selector: 'app-shows',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgForOf,
    NgIf,
    MapToArrayPipe
  ],
  templateUrl: './shows.component.html',
  styleUrl: './shows.component.css'
})
export class ShowsComponent implements OnInit{

  shows: ShowModel[] = [];

  title = 'Concert Name';
  category = 'Music';
  description = 'Join us for an amazing night of music and entertainment.';
  date = '2023-12-15';
  time = '19:00';
  duration = '2 hours';
  seatCategory = 'VIP';
  price = 99.99;
  location = '123 Concert Hall, City, Country';

  constructor(private managementService: ManagementService,
              private alertService: AlertService,
              private router: Router) {
  }
  ngOnInit(): void {

    this.managementService.getAllShows().subscribe({

      next: (response) => {
        this.shows = response;
        if (this.shows)
        console.log(this.shows);
      },
      error: (error) => {
        console.error('Error fetching shows:', error);
      }

    })
  }

  convertDurationToHHMM(duration: string): string {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);

    if (!match) {
      throw new Error("Invalid duration format");
    }

    const hours = parseInt(match[1] || "0", 10);
    const minutes = parseInt(match[2] || "0", 10);

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
  }

  createShow() {
    const urlTree = this.router.createUrlTree(['/show']);
    this.router.navigateByUrl(urlTree).then(() => {});
  }

  editShow(showId: string) {
    const urlTree = this.router.createUrlTree(['/show', encodeURIComponent(showId)]);
    this.router.navigateByUrl(urlTree).then(() => {});
  }
  deleteShow(showId: string) {
    if (confirm("Are you sure you want to delete this show?")) {
      this.managementService.deleteShow(showId).subscribe({
        next: (response) => {
          this.alertService.openAlert({isError: false, message: "Show deleted successfully!"});
          this.ngOnInit();
        },
        error: (error) => {
          this.alertService.openAlert({isError: true, message: error.getMessage()})
        }
      });
    }
  }
}
