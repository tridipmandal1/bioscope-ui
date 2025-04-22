import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavbarComponent} from "./components/navbar/navbar.component";
import {HostLandingComponent} from "./components/landing/host-landing/host-landing.component";
import {HomeComponent} from "./components/home/home.component";
import {CommonModule, NgIf} from "@angular/common";
import {MatDialogModule} from "@angular/material/dialog";
import {ToastNotificationComponent} from "./utils/toast-notification/toast-notification.component";
import {UserLandingComponent} from "./components/landing/user-landing/user-landing.component";
import {ShowDetailsComponent} from "./components/user/show-details/show-details.component";
import {MovieShowsComponent} from "./components/user/movie-shows/movie-shows.component";
import {ShowSeatingComponent} from "./components/user/show-seating/show-seating.component";
import {UserAuthComponent} from "./components/modal/user-auth/user-auth.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent,
    HostLandingComponent, HomeComponent,
    NgIf, CommonModule, MatDialogModule, ToastNotificationComponent, UserLandingComponent, ShowDetailsComponent, MovieShowsComponent, ShowSeatingComponent, UserAuthComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'bioscope-ui';

}

