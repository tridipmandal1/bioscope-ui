import { Component } from '@angular/core';
import {RowDataModel} from "../../../model/RowDataModel";
import {ScreenRequest} from "../../../model/ScreenRequest";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {MatTooltip} from "@angular/material/tooltip";
import {ManagementService} from "../../../service/management.service";
import {AlertService} from "../../../service/alert.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-screen',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    MatTooltip
  ],
  templateUrl: './create-screen.component.html',
  styleUrl: './create-screen.component.css'
})
export class CreateScreenComponent {

  constructor(private managementService: ManagementService,
              private alertService: AlertService,
              private router: Router,
  ) {
  }

  screen: ScreenRequest = new ScreenRequest();
  arrangementTypes: string[] = ['SITTING', 'STANDING'];
  categories: string[] = ['REGULAR', 'PREMIUM', 'VIP'];

  addRow(): void {
    this.screen.rowData.push(new RowDataModel());
  }

  removeRow(index: number): void {
    this.screen.rowData.splice(index, 1);
  }

  handleSubmit(): void {
    // Clean or validate passageFollowed
    this.screen.rowData.forEach(row => {
      if (typeof row.passageFollowed === 'string') {
        row.passageFollowed = (row.passageFollowed as any)
          .split(',')
          .map((x: string) => Number(x.trim()))
          .filter((x: number) => !isNaN(x));
      }
    });

    this.managementService.createScreen(this.screen).subscribe({
      next: (response) => {
          this.alertService.openAlert({isError: false, message: 'Screen created successfully!'});
          this.router.navigate(['/host/home']).then(
            () => {
              window.location.reload();
            }
          );
      },
      error: (error) => {
          this.alertService.openAlert({isError: true, message: 'Failed to create screen!'});
      }
    })
  }
}
