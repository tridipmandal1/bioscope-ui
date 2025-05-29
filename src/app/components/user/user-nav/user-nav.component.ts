import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../../service/user.service";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../../service/auth.service";
import {User} from "../../../model/User";
import {AlertService} from "../../../service/alert.service";

@Component({
  selector: 'app-user-nav',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    FormsModule,
    NgIf
  ],
  templateUrl: './user-nav.component.html',
  styleUrl: './user-nav.component.css'
})
export class UserNavComponent implements OnInit{
  isDropdownOpen: boolean = false;
  selectedLocation: string = 'Kalyani';
  cities: string[] = [];
  filteredCities: string[] = [];
  searchQuery: string = '';
  isLoggedIn: boolean = false;
  currentUser: User = new User();
  isUserDropdownOpen: boolean = false;


  constructor(private router: Router,
              private userService: UserService,
              private elementRef: ElementRef,
              private authService: AuthService,
              private alertService: AlertService) {
  }

  ngOnInit() {
    this.isUserDropdownOpen = false;
    this.isDropdownOpen = false;
    this.userService.getCities().subscribe({
      next: (response) => {
        this.cities = response.data;
        this.filteredCities = [...this.cities];
      },
      error: (error) => {
        console.error('Error fetching cities:', error);
      }
    });
    this.isLoggedIn = this.authService.isAuthenticated();
    this.currentUser = this.authService.getCurrentLoggedUser();
  }

  search() {
    if(this.searchQuery.trim() === ''){
      return;
    }
    let location = localStorage.getItem('location');
    const query = encodeURIComponent(this.searchQuery.trim());
    if(location) {
      const urlTree = this.router.createUrlTree(['/search', query]);
      this.router.navigateByUrl(urlTree).then(() => {
        this.searchQuery = '';
        window.scrollTo(0, 0);
        window.location.reload();
      });
    }else{
      this.alertService.openAlert({isError: true, message: 'Please select a location first!'});
    }

  }
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.searchQuery = '';
      this.filterCities();
    }
  }

  selectLocation(city: string, event: Event): void {
    event.preventDefault();
    this.selectedLocation = city;
    localStorage.setItem('location', city);
    this.isDropdownOpen = false;
    this.searchQuery = '';
    this.filterCities();
  }

  filterCities(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredCities = query
      ? this.cities.filter(city => city.toLowerCase().includes(query))
      : [...this.cities];
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleDropdown();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const clickedInsideLocation = this.elementRef.nativeElement.querySelector('.location-dropdown')?.contains(event.target);

    if (!clickedInsideLocation) {
      this.isDropdownOpen = false;
      this.searchQuery = '';
      this.filterCities();
    }
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isUserDropdownOpen = false;
    }
  }


  onSignIn() {
    const urlTree = this.router.createUrlTree(['/join']);
    this.router.navigateByUrl(urlTree).then(() => {});
  }

  goToProfile() {
    const urlTree = this.router.createUrlTree(['/user/profile']);
    this.router.navigateByUrl(urlTree).then(() => {});
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['']).then(() => {
      window.location.reload();
    });
  }

  openMenu() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  goToHome() {
    this.router.navigate(['']).then(() => {

    });
  }
}
