import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RowDataModel} from "../../../model/RowDataModel";
import {ManagementService} from "../../../service/management.service";
import {NgForOf} from "@angular/common";
import bootstrap from "../../../../main.server";
import {MatTooltip} from "@angular/material/tooltip";
import {AlertService} from "../../../service/alert.service";

@Component({
  selector: 'app-edit-row',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    MatTooltip
  ],
  templateUrl: './edit-row.component.html',
  styleUrl: './edit-row.component.css'
})
export class EditRowComponent implements OnInit{

  rowData: RowDataModel;
  arrId: string = '';
  passageString: string = '';
  categories: string[] = ['REGULAR', 'PREMIUM', 'VIP'];

  constructor(
    public dialogRef: MatDialogRef<EditRowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { row: RowDataModel, arrangementId: string },
    private managementService: ManagementService,
    private alertService: AlertService
  ) {
    this.rowData = { ...data.row };
    this.arrId = data.arrangementId;
  }
  ngOnInit(): void {
    this.passageString = this.rowData.passageFollowed.join(',');
  }

  save(): void {
      this.rowData.passageFollowed = this.passageString
        .split(',')
        .map((n: string) => Number(n.trim()))
        .filter((n: number) => !isNaN(n));
        this.managementService.updateSeatingByOneRow(this.arrId, this.rowData).subscribe({
          next: response => {
            this.dialogRef.close();
            this.alertService.openAlert({isError: false, message: 'Row updated successfully!'});
          },
          error: err => {
            this.dialogRef.close();
            this.alertService.openAlert({isError: true, message: 'Error updating row!'});
          }
        });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
