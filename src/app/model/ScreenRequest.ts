import {RowDataModel} from "./RowDataModel";

export class ScreenRequest {
  screenName: string = '';
  arrangementType: string = ''; // dropdown SITTING or STANDING
  capacity: number = 0;
  rowData: RowDataModel[] = []; // have to take multiple row data without any fixed number
}
