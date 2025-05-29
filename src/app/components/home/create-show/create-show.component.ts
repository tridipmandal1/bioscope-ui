import {Component, HostListener, Input, OnInit} from '@angular/core';
import {ShowModel} from "../../../model/ShowModel";
import {Movie} from "../../../model/Movie";
import {Screen} from "../../../model/Screen";
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {ManagementService} from "../../../service/management.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PassPrice} from "../../../model/PassPrice";
import {AlertService} from "../../../service/alert.service";



@Component({
  selector: 'app-create-show',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './create-show.component.html',
  styleUrl: './create-show.component.css'
})
export class CreateShowComponent implements OnInit{

  @Input() showData: ShowModel = new ShowModel();


  constructor(private managementService: ManagementService,
              private alertService: AlertService,
              private activeRoute: ActivatedRoute,
              private router: Router) {
  }
  show: ShowModel = new ShowModel();
  movies: Movie[] = [];
  showTypes: string[] = ['MOVIE', 'MUSIC', 'COMEDY', 'CONCERT'];
  arrangementTypes: string[] = ['STANDING', 'SITTING', 'BOTH'];
  screens: Screen[] = [];
  ticketCategories: PassPrice[] = [];

  ngOnInit(): void {
    this.activeRoute.params.subscribe(params => {
      let id = decodeURIComponent(params['id']);
      if (id) {
        this.managementService.getShowById(id).subscribe({
          next: response => {
            this.show = response;
            this.ticketCategories = this.show.ticketPrice;
            this.show.showDuration = this.parseISODuration(this.show.showDuration);
            console.log('Show fetched:', this.show);
          },
          error: err => {
            console.error('Error fetching show:', err);
          }
        });
      }
    })
    this.managementService.getMovies().subscribe({
      next: response => {
        this.movies = response;
      },
      error: err => {
        console.error('Error fetching movies:', err);
      }
    });

    this.managementService.getAllScreens().subscribe({
      next: response => {
        this.screens = response;
    }, error: err => {
        console.log(err);
      }
    })
  }

  @HostListener('window.popstate', ['$event'])
  onPopState(event: any) {
    console.log('Back button pressed');
  }

  addTicketCategory(): void {
    this.ticketCategories.push({id: '', category: '', reserved: 0, capacity:0, price: 0 });
  }

  removeTicketCategory(index: number): void {
    this.ticketCategories.splice(index, 1);
  }


  formatDuration(time: string): string {
    const [hoursStr, minutesStr, secondsStr] = time.split(":");
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    const h = hours.toString().padStart(2, '0');
    const m = minutes.toString().padStart(2, '0');

    return `PT${h}H${m}M`;
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

  submit(): void {
    if (!this.show.showDuration) {
      this.show.showDuration = '';
    }else {
    this.show.showDuration = this.formatDuration(this.show.showDuration);
    }
    this.show.ticketPrice = this.ticketCategories;
    console.log('New Show:', this.show);
    if (this.show.screenId) {
      if (this.show.showId) {
        this.managementService.updateShow(this.show.showId, this.show).subscribe({
          next: response => {
            this.alertService.openAlert({isError: false, message: 'Show updated successfully'});
            this.router.navigate(['/host/home']).then(() => {});
          },
          error: err => {
            this.alertService.openAlert({isError: true, message: err.message});
          }
        });
      } else {
        this.managementService.createShow(this.show.screenId, this.show).subscribe({
          next: response => {
            this.alertService.openAlert({isError: false, message: 'Show created successfully'});
            this.router.navigate(['/host/home']).then(() => {});
          },
          error: err => {
            this.alertService.openAlert({isError: true, message: err.message});
          }
        });
      }
    } else {
      if (this.show.showId) {
        this.managementService.updateOpenShow(this.show.showId, this.show).subscribe({
          next: response => {
            this.alertService.openAlert({isError: false, message: 'Show updated successfully'});
            this.router.navigate(['/host/home']).then(() => {});
          },
          error: err => {
            this.alertService.openAlert({isError: true, message: err.message});
          }
        });
      } else {
        this.managementService.createOpenShow(this.show).subscribe({
          next: response => {
            this.alertService.openAlert({isError: false, message: 'Show created successfully'});
            this.router.navigate(['/host/home']).then(() => {});
          },
          error: err => {
            this.alertService.openAlert({isError: true, message: err.message});
          }
        });
      }
    }
  }

  goBack() {
      if(confirm('Are you sure you want to go back? Unsaved changes will be lost.')) {
        this.router.navigate(['/host/home']).then(() =>{});
      }
  }

  findScreenFromList(screenId: string): Screen | undefined {
    console.log('Finding screen with ID:', screenId);
    console.log(this.screens.find(screen => screen.screenId === screenId));
    return this.screens.find(screen => screen.screenId === screenId);
  }
}
