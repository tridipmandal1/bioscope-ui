import {Component, OnInit} from '@angular/core';
import {ScreensComponent} from "./screens/screens.component";
import {SeatMatrixComponent} from "./seat-matrix/seat-matrix.component";
import {ShowsComponent} from "./shows/shows.component";
import {CreateShowComponent} from "./create-show/create-show.component";
import {CreateScreenComponent} from "./create-screen/create-screen.component";
import {HostService} from "../../service/host.service";
import {AuthRequest} from "../../model/AuthRequest";
import {HttpClient} from "@angular/common/http";
import {NavbarComponent} from "../navbar/navbar.component";
import {NgIf} from "@angular/common";
import {TrendingComponent} from "./trending/trending.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {TicketCheckingComponent} from "./ticket-checking/ticket-checking.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ScreensComponent,
    SeatMatrixComponent,
    ShowsComponent,
    CreateShowComponent,
    CreateScreenComponent,
    NavbarComponent,
    NgIf,
    TrendingComponent,
    DashboardComponent,
    TicketCheckingComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  tabName = 'screens';
  constructor(private hostService: HostService, private http: HttpClient) {
  }

  ngOnInit() {

  }

  currentTab(name: string) {
    this.tabName = name;
  }
}
