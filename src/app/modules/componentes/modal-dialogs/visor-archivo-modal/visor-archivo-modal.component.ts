import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
//import { DialogData } from '../aviso-datos-personales-dialog/aviso-datos-personales-dialog.component';

export interface DialogData {
  nombre:string,
  url:string 
}

@Component({
  selector: 'app-visor-archivo-modal',
  templateUrl: './visor-archivo-modal.component.html',
  styleUrls: ['./visor-archivo-modal.component.css']
})
export class VisorArchivoModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<VisorArchivoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  ngOnInit(): void {
  }

}
