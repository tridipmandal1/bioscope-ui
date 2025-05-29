import { Injectable } from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AlertComponent} from "../components/modal/alert/alert.component";

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private isAlertOpened: boolean = false;

  constructor(private alertDialog: MatDialog) { }

  openAlert(data: {isError: boolean, message: string}): any {
    if (this.isAlertOpened) {
      return false;
    }
    this.isAlertOpened = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.data = data;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'my-no-padding-dialog';
    const dialogRef = this.alertDialog.open(AlertComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      console.log('Alert dialog closed');
      this.isAlertOpened = false;
    });

    return dialogRef;
  }
}
