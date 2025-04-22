import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {UserNavComponent} from "../../user/user-nav/user-nav.component";
import {Movie} from "../../../model/Movie";
import {ShowModel} from "../../../model/ShowModel";
import {UserService} from "../../../service/user.service";
import {Router} from "@angular/router";


interface Event {
  id: number;
  title: string;
  description: string;
  image: string;
}


@Component({
  selector: 'app-user-landing',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    NgIf,
    UserNavComponent
  ],
  templateUrl: './user-landing.component.html',
  styleUrl: './user-landing.component.css'
})
export class UserLandingComponent implements OnInit{

  featuredEvents: Event[] = [
    {
      id: 1,
      title: 'Avengers: Endgame',
      description: 'The epic conclusion to the Marvel saga. Book your tickets now!',
      image: 'https://iili.io/3EcBvEl.md.jpg'
    },
    {
      id: 2,
      title: 'Summer Music Festival',
      description: 'Three days of non-stop music with your favorite artists.',
      image: 'https://iili.io/3EcJMCP.md.jpg'
    },
    {
      id: 3,
      title: 'Bahubali: The Conclusion',
      description: 'Experience the epic saga of Bahubali final chapter.',
      image: 'https://iili.io/3EcoqmX.md.jpg'
    },
    {
      id: 4,
      title: 'Arijit Singh Music Concert',
      description: 'Join the king of Bollywood and Bengali music live in concert.',
      image: 'https://iili.io/3EcfyKB.md.jpg'
    }
  ];

  recommendedMovies: Movie[] = [];

  trendingShows: ShowModel[] = [];

  constructor(private userService: UserService,
              private router: Router) { }

  ngOnInit(): void {
    this.initCarousel();


    this.userService.getTrendingMovies().subscribe((response: any) => {
      this.recommendedMovies = response.body;
    });

    this.userService.getTrendingShows('Kalyani').subscribe((response: any) => {
      this.trendingShows = response.body;
    });
  }

  private initCarousel(): void {
    // This would typically be done with ViewChild and AfterViewInit
    // But for simplicity, we're using a timeout to ensure DOM is ready
    setTimeout(() => {
      // Bootstrap 5 carousel initialization would happen here
      // In a real app, you might use ViewChild to get the element and initialize it
      // or use a directive to initialize the carousel
    }, 100);
  }
  scrollLeft(container: HTMLElement) {
    container.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight(container: HTMLElement) {
    container.scrollBy({ left: 300, behavior: 'smooth' });
  }

  openShowPage(id: string) {
    const urlTree = this.router.createUrlTree(['/shows', encodeURIComponent(id)]);
    this.router.navigateByUrl(urlTree).then(() => {});
  }

  openMoviePage(id: string) {
    console.log(id);
    const urlTree = this.router
      .createUrlTree(['/movies', encodeURIComponent(id)], {
        queryParams: { id: encodeURIComponent(id) }
      });
    this.router.navigateByUrl(urlTree).then(() => {});
  }
}
