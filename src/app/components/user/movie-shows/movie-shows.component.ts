import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../service/user.service";
import {AlertService} from "../../../service/alert.service";
import {Movie} from "../../../model/Movie";
import {User} from "../../../model/User";

@Component({
  selector: 'app-movie-shows',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './movie-shows.component.html',
  styleUrl: './movie-shows.component.css'
})
export class MovieShowsComponent implements OnInit{

  movie: Movie = new Movie();

  allHosts: User[] = [];
  filteredHosts: User[] = [];
  availableDates: Set<string> = new Set<string>();
  sortedDates: string[] = [];
  selectedDate: string = '';

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private alertService: AlertService) { }

  ngOnInit(): void {
    this.generateDates();
    this.selectedDate = this.sortedDates[0];
    this.loadCinemaHalls();
    let movieId = decodeURIComponent(this.activatedRoute.snapshot.params['id']);
    let location = localStorage.getItem('location');
    if(movieId) {
      if (location){
          this.userService.getMovie(movieId).subscribe({
            next: (response) => {
              this.movie = response.body;
            },
            error: (error) => {
              console.error('Error fetching movie details:', error);
            }
          });
          this.userService.getHostsByMovieNameAndLocation(this.movie.title, location)
            .subscribe({
            next: (response) => {
              this.allHosts = response.body;
              this.allHosts.forEach((host) => {
                host.shows.forEach((show) => {
                  this.availableDates.add(show.showDate);
                });
              });
            },
            error: (error) => {
              console.error('Error fetching hosts:', error);
            }
          });
      }else {
        this.alertService.openAlert({isError: true, message: 'Please select a location first!'});
      }
    }
  }

  generateDates(): void {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();

    // Generate dates for the next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);

      const dateOption: DateOption = {
        day: days[date.getDay()],
        date: date.getDate().toString(),
        value: this.formatDate(date)
      };

      this.availableDates.push(dateOption);
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  loadCinemaHalls(): void {
    // This would typically come from an API
    // Mock data for demonstration
    this.cinemaHalls = [
      {
        id: 1,
        name: 'PVR Cinemas',
        location: 'Downtown Mall, Central Avenue',
        date: this.availableDates[0].value,
        shows: [
          { id: 101, time: '10:30 AM', price: 12.99 },
          { id: 102, time: '1:45 PM', price: 14.99 },
          { id: 103, time: '5:15 PM', price: 16.99 },
          { id: 104, time: '9:00 PM', price: 18.99 }
        ]
      },
      {
        id: 2,
        name: 'INOX Multiplex',
        location: 'City Center, West Boulevard',
        date: this.availableDates[0].value,
        shows: [
          { id: 201, time: '11:00 AM', price: 11.99 },
          { id: 202, time: '2:30 PM', price: 13.99 },
          { id: 203, time: '6:00 PM', price: 15.99 },
          { id: 204, time: '9:30 PM', price: 17.99 }
        ]
      },
      {
        id: 3,
        name: 'Cinepolis',
        location: 'Riverside Mall, East Street',
        date: this.availableDates[0].value,
        shows: [
          { id: 301, time: '10:00 AM', price: 10.99 },
          { id: 302, time: '1:15 PM', price: 12.99 },
          { id: 303, time: '4:45 PM', price: 14.99 },
          { id: 304, time: '8:30 PM', price: 16.99 }
        ]
      },
      {
        id: 4,
        name: 'PVR Cinemas',
        location: 'Downtown Mall, Central Avenue',
        date: this.availableDates[1].value,
        shows: [
          { id: 401, time: '11:30 AM', price: 12.99 },
          { id: 402, time: '2:45 PM', price: 14.99 },
          { id: 403, time: '6:15 PM', price: 16.99 },
          { id: 404, time: '10:00 PM', price: 18.99 }
        ]
      },
      {
        id: 5,
        name: 'INOX Multiplex',
        location: 'City Center, West Boulevard',
        date: this.availableDates[1].value,
        shows: [
          { id: 501, time: '12:00 PM', price: 11.99 },
          { id: 502, time: '3:30 PM', price: 13.99 },
          { id: 503, time: '7:00 PM', price: 15.99 }
        ]
      }
    ];
  }

  selectDate(date: string): void {
    this.selectedDate = date;
  }

  getHallsForSelectedDate(): CinemaHall[] {
    return this.cinemaHalls.filter(hall => hall.date === this.selectedDate);
  }

  selectShow(hall: CinemaHall, show: ShowTime): void {
    // This would typically navigate to a booking page or open a modal
    console.log(`Selected show: ${show.time} at ${hall.name} on ${this.selectedDate}`);
    alert(`Selected show: ${show.time} at ${hall.name} on ${this.selectedDate}`);
    // You could implement navigation to booking page:
    // this.router.navigate(['/booking'], {
    //   queryParams: {
    //     movieId: this.movie.id,
    //     hallId: hall.id,
    //     showId: show.id,
    //     date: this.selectedDate
    //   }
    // });
  }

  sortDateSet(dateSet: Set<string>): string[] {
    const dateArray = Array.from(dateSet);
    return dateArray.sort((a, b) => {
      const [dayA, monthA, yearA] = a.split('-').map(Number);
      const [dayB, monthB, yearB] = b.split('-').map(Number);

      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);

      return dateA.getTime() - dateB.getTime();
    });
  }
}
