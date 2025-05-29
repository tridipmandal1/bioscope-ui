import {Component, Input, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {Router} from "@angular/router";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ErrorComponent implements OnInit{

  @Input() errorTitle: string = 'Oops! Something went wrong';
  @Input() errorMessage: string = 'We encountered an issue while processing your request. Please try again or return to the homepage.';
  @Input() errorCode: string = '404';
  currentTime: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
      this.currentTime = new Date().getTime().toString();
  }

  goToHomepage(): void {
    this.router.navigate(['']).then(() => {});
  }
}
