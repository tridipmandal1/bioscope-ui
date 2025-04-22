import {Component, ElementRef, HostListener, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../../service/user.service";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

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

  constructor(private router: Router,
              private userService: UserService,
              private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.userService.getCities().subscribe({
      next: (response) => {
        this.cities = response.data;
        this.filteredCities = [...this.cities];
      },
      error: (error) => {
        console.error('Error fetching cities:', error);
      }
    });
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
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
      this.searchQuery = '';
      this.filterCities();
    }
  }

  onSignIn() {
    const urlTree = this.router.createUrlTree(['/join']);
    this.router.navigateByUrl(urlTree).then(() => {});
  }
}
