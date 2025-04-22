import {Component, OnInit} from '@angular/core';
import {ManagementService} from "../../../service/management.service";
import {AlertService} from "../../../service/alert.service";
import {Router} from "@angular/router";
import {Screen} from "../../../model/Screen";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-screens',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './screens.component.html',
  styleUrl: './screens.component.css'
})
export class ScreensComponent implements OnInit {

  screens: Screen[] = [];

  constructor(
    private managementService: ManagementService,
    private alertService: AlertService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.managementService.getAllScreens().subscribe({
      next: (screens) => {
        this.screens = screens;
      },
      error: (error) => {
        this.alertService.openAlert({isError: true, message: error.error.message});
      }
    })
  }


  viewMatrix(arrangementId: string) {
    const urlTree = this.router
      .createUrlTree(['/seating', encodeURIComponent(arrangementId)]);
    this.router.navigateByUrl(urlTree).then(() => {
      window.scrollTo(0, 0);
    });
  }

  createScreen() {
    const urlTree = this.router.createUrlTree(['/screen/create']);
    this.router.navigateByUrl(urlTree).then(() => {
      window.scrollTo(0, 0);
    });
  }

  deleteScreen(screenId: string) {
    if(confirm('Are you sure you want to delete this screen?')) {
      this.managementService.deleteScreen(screenId).subscribe({
        next: () => {
          this.ngOnInit();
          this.alertService.openAlert({isError: false, message: 'Screen deleted successfully!'});
        },
        error: (error) => {
          this.alertService.openAlert({isError: true, message: error.error.message});
        }
      })
    }
  }

  editScreen(screenId: string) {

  }
}
