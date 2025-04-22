import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgClass, NgForOf, NgOptimizedImage} from "@angular/common";
import {HostService} from "../../service/host.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgForOf,
    NgOptimizedImage,
    NgClass
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{

  constructor(private hostService: HostService, private router: Router) {
  }

  username = 'Guest';
  ngOnInit(): void {
    this.hostService.getUserProfile().subscribe({
      next: (response) => {
        this.username = response.body.name;
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
      }
    })
  }

  currentTab = 'screens';
  @Output() tab = new EventEmitter<string>;

  categories: string[] = ['Category 1', 'Category 2', 'Category 3', 'Category 4'];
  selectedCategory: string = 'Select Category';

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  changeTab(tab: string) {
    this.currentTab = tab;
    this.tab.emit(tab);
  }

  logout() {
    this.hostService.logout();
    this.router.navigate(['/auth']).then(r => {});
  }
}
