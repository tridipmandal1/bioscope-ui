import { Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {authGuard} from "./guard/auth.guard";
import {HostLandingComponent} from "./components/landing/host-landing/host-landing.component";
import {CreateShowComponent} from "./components/home/create-show/create-show.component";
import {SeatMatrixComponent} from "./components/home/seat-matrix/seat-matrix.component";
import {CreateScreenComponent} from "./components/home/create-screen/create-screen.component";
import {ShowDetailsComponent} from "./components/user/show-details/show-details.component";
import {UserLandingComponent} from "./components/landing/user-landing/user-landing.component";
import {UserAuthComponent} from "./components/modal/user-auth/user-auth.component";
import {OpenBookingComponent} from "./components/user/open-booking/open-booking.component";
import {MovieShowsComponent} from "./components/user/movie-shows/movie-shows.component";

export const routes: Routes = [

  {path: 'show/:id', component: CreateShowComponent, canActivate: [authGuard]}, // for edit
  {path: 'show', component: CreateShowComponent, canActivate: [authGuard]}, // for create
  {path: 'screen/create', component: CreateScreenComponent, canActivate: [authGuard]}, // for create
  {path: 'seating/:id', component: SeatMatrixComponent, canActivate: [authGuard]},
  {path: 'host/home', component: HomeComponent, canActivate: [authGuard]},
  {path: 'host', component: HostLandingComponent},
  {path: '', component: UserLandingComponent},
  {path: 'join', component: UserAuthComponent},
  {path: 'shows/:id', component: ShowDetailsComponent},
  {path: 'bookings/open/:id', component: OpenBookingComponent},
  {path: 'movies/:id', component: ShowDetailsComponent},
  {path: 'movie/shows/:id',  component: MovieShowsComponent}
];
