import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../service/user.service";
import {AlertService} from "../../../service/alert.service";
import {Movie} from "../../../model/Movie";
import {User} from "../../../model/User";
import {ShowModel} from "../../../model/ShowModel";
import {UserNavComponent} from "../user-nav/user-nav.component";

@Component({
  selector: 'app-movie-shows',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    UserNavComponent
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
    this.selectedDate = this.sortedDates[0];
    this.loadCinemaHalls();
    let movieId = decodeURIComponent(this.activatedRoute.snapshot.params['id']);
    let location = localStorage.getItem('location');
    if(movieId) {
      if (location){
          this.userService.getMovie(movieId).subscribe({
            next: (response) => {
              this.movie = response.body;
              console.log(this.movie);
              this.userService.getHostsByMovieNameAndLocation(this.movie.title, location)
                .subscribe({
                  next: (response) => {
                    this.allHosts = response.body;
                    console.log('all hosts:', this.allHosts);
                    this.allHosts.forEach((host) => {
                      host.shows.forEach((show) => {
                        console.log('putting date:', show.showDate);
                        this.availableDates.add(show.showDate);
                      });
                      host.shows.filter(show => show.movie.title===this.movie.title)
                    });
                    this.selectedDate = this.sortDateSet(this.availableDates)[0];
                    this.sortedDates = this.sortDateSet(this.availableDates);
                    this.loadCinemaHalls();
                  },
                  error: (error) => {
                    console.error('Error fetching hosts:', error);
                  }
                });
            },
            error: (error) => {
              console.error('Error fetching movie details:', error);
            }
          });
      }else {
        console.error('Location not found in local storage' + location);
      }
    }
  }

  getWeekdayFromDate(dateStr: string): string {
    const [day, month, year] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day); // JS months are 0-indexed

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekdays[date.getDay()];
  }


  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  loadCinemaHalls(): void {
    console.log('all dates', this.availableDates);
    console.log('all dates sorted', this.sortDateSet(this.availableDates));
    console.log('Loading cinema halls for date:', this.selectedDate);
    // this.filteredHosts = this.allHosts
    //   .map(host => ({
    //     ...host,
    //     shows: host.shows.filter(show => show.showDate === this.selectedDate)
    //   }))
    //   .filter(host => host.shows.length > 0);

    this.allHosts.forEach(host => {
      console.log()
      let fShows = host.shows
        .filter(show => show.showDate === this.selectedDate && show.movie.movieId === this.movie.movieId);
      console.log('Filtered shows:', fShows);
      this.filteredHosts.push({...host, shows: fShows});
    })
    console.log('Filtered hosts:', this.filteredHosts);
  }

  selectDate(date: string): void {
    this.selectedDate = date;
    console.log('Selected date:', this.selectedDate);
    this.filteredHosts = [];
    this.loadCinemaHalls();
  }


  selectShow(hall: User, show: ShowModel): void {
    const urlTree = this.router
      .createUrlTree(['/movie/shows/seating', encodeURIComponent(show.showId)]);
    this.router.navigateByUrl(urlTree).then(r => {});
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
