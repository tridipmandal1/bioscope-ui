import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {Movie} from "../../../model/Movie";
import {UserService} from "../../../service/user.service";
import {ShowModel} from "../../../model/ShowModel";

@Component({
  selector: 'app-show-details',
  standalone: true,
  imports: [
    NgClass,
    NgForOf,
    NgIf
  ],
  templateUrl: './show-details.component.html',
  styleUrl: './show-details.component.css'
})
export class ShowDetailsComponent implements OnInit{
  isMovie: boolean = false;
  movie: Movie = new Movie();
  show: ShowModel = new ShowModel();
  stars: string[] = [];
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private userService: UserService) {
  }

  ngOnInit(): void {

      if(this.router.url.includes('movies')) {
        this.isMovie = true;
        let id = decodeURIComponent(this.activatedRoute.snapshot.params['id']);
        if (id) {
        this.userService.getMovie(id).subscribe({
          next: (response) => {
            this.movie = response.body;
            this.stars = this.movie.casts.split(',');
          },
          error: (error) => {
            console.error('Error fetching movie details:', error);
          }
        });
      }
      }
      if(this.router.url.includes('shows')) {
        this.isMovie = false;
        let id = decodeURIComponent(this.activatedRoute.snapshot.params['id']);
        console.log(id);
        if (id) {
          this.userService.getShow(id).subscribe({
            next: (response) => {
              console.log(response.body);
              this.show = response.body;
            },
            error: (error) => {
              console.error('Error fetching show details:', error);
            }
          });
        }
      }
  }

  maxRating = 10


  rateMovie(): void {
    alert("Rating functionality would be implemented here")
  }

  bookNow(id: string): void {
    if(this.router.url.includes('shows')){
      const urlTree = this.router.createUrlTree(['/bookings/open', encodeURIComponent(id)]);
      this.router.navigateByUrl(urlTree).then(() => {});
    }
    if(this.router.url.includes('movies')){
      const urlTree = this.router.createUrlTree(['/movie/open', encodeURIComponent(id)]);
      this.router.navigateByUrl(urlTree).then(() => {});
    }
  }

  // Helper method to generate star rating display
  generateStars(rating: number): number[] {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = Math.floor(this.maxRating - rating)

    const stars = []

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(1)
    }

    // Half star
    if (hasHalfStar) {
      stars.push(0.5)
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(0)
    }

    return stars.slice(0, this.maxRating)
  }

  protected readonly Number = Number;

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
