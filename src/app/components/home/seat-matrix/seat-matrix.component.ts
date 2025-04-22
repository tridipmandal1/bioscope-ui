import {Component, Input, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {SeatMatrix} from "../../../model/SeatMatrix";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ManagementService} from "../../../service/management.service";
import {RowDataModel} from "../../../model/RowDataModel";
import {EditRowComponent} from "../../modal/edit-row/edit-row.component";
import {SeatRowModel} from "../../../model/SeatRowModel";

@Component({
  selector: 'app-seat-matrix',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './seat-matrix.component.html',
  styleUrl: './seat-matrix.component.css'
})
export class SeatMatrixComponent implements OnInit{

  seatMatrix: SeatMatrix = new SeatMatrix();
  public isEditDialogOpen = false;

  constructor(
    private managementService: ManagementService,
    private matDialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      let arrangementId = decodeURIComponent(params['id']);
      if(arrangementId) {
        this.managementService.getSeatingArrangementById(arrangementId).subscribe({
          next: response => {
            this.seatMatrix = response;
          },
          error: err => {
            console.error('Error fetching seating arrangement:', err);
          }
        });
      }
    })

  }


  openRowEditor( info :{ rw: SeatRowModel, arrId: string }) {
    this.isEditDialogOpen = true;
    const matEditConfig = new MatDialogConfig();
    matEditConfig.disableClose = true;
    matEditConfig.autoFocus = true;
    let rowData: RowDataModel = new RowDataModel();
    rowData.rowIndex = info.rw.rowIndex;
    rowData.seatsInRow = info.rw.seats.length;
    rowData.priceInRow = info.rw.seats[0].price;
    rowData.passageFollowed = info.rw.passageAfterwards;
    rowData.category = info.rw.seatCategory;
    matEditConfig.data = {
      row: rowData,
      arrangementId: info.arrId
    };
    matEditConfig.panelClass = 'my-no-padding-dialog';
    matEditConfig.width = '400px';
    matEditConfig.height = '550px';
    const dialogRef = this.matDialog.open(EditRowComponent, matEditConfig);
    dialogRef.afterClosed().subscribe({
      next: value => {
        this.ngOnInit();
      }
    });

   }

   occurrence(arr: number[], value: number) {
     return arr.filter(v => v === value);
   }

  getPassagesAtIndex(passageAfterwards: number[], index: number): any[] {
    const count = passageAfterwards.filter((x) => x === index).length;
    return new Array(count);
  }
}
