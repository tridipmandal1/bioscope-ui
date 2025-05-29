import {Component, OnInit} from '@angular/core';
import {Movie} from "../../../model/Movie";
import {ShowModel} from "../../../model/ShowModel";
import {User} from "../../../model/User";
import {DatePipe, NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {UserService} from "../../../service/user.service";
import {finalize} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {UserNavComponent} from "../user-nav/user-nav.component";


@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    NgStyle,
    DatePipe,
    NgForOf,
    UserNavComponent
  ],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent implements OnInit{

  movies: Movie[] = [];
  shows: ShowModel[] = [];
  hosts: User[] = [];
  message: string = '';

  isLoading = true;
  activeTab = 'movies';

  // Create arrays for skeleton loading
  skeletonItems = Array(4).fill(0);

  constructor(private userService: UserService,
              private router: Router,
              private actRoute: ActivatedRoute) { }

  ngOnInit(): void {
    let query = decodeURIComponent(this.actRoute.snapshot.params['query']);
    let location = localStorage.getItem('location') || 'Kalyani';
    this.fetchSearchResults(query, location);
  }

  fetchSearchResults(query: string, location: string): void {
    this.isLoading = true;

    this.userService.search(query, location)
      .pipe(
        finalize(() => {
          // Add a slight delay to make the loading animation visible
          setTimeout(() => {
            this.isLoading = false;
          }, 1500);
        })
      )
      .subscribe({
        next: (response) => {
          this.movies = response.body.movies;
          this.shows = response.body.shows;
          this.hosts = response.body.hosts;

          console.log('Movies:', this.movies);
          console.log('Shows:', this.shows);
          console.log('Hosts:', this.hosts);
        },
        error: (error) => {
          console.error('Error fetching search results:', error);
        }
      });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  // Helper method to get random width for skeleton loading
  getRandomWidth(): string {
    const widths = ['75%', '85%', '65%', '90%'];
    return widths[Math.floor(Math.random() * widths.length)];
  }

  openShow(id: string) {
    const urlTree = this.router.createUrlTree(['/shows', encodeURIComponent(id)]);
    this.router.navigateByUrl(urlTree).then(() => {});
  }

  openMovie(id: string) {
    const urlTree = this.router
      .createUrlTree(['/movies', encodeURIComponent(id)]);
    this.router.navigateByUrl(urlTree).then(() => {});
  }
}
