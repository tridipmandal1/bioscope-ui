import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {

  title: string = 'Alert';
  message: string = 'This is an alert message';

  constructor(@Inject(MAT_DIALOG_DATA) public matData: {isError: boolean, message: string},
              private alertRef: MatDialogRef<AlertComponent>) { }

  ngOnInit(): void {
  }


  closeModal() {
    this.alertRef.close();
  }
}
