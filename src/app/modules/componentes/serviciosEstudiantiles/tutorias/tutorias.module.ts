import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
//Angular Material
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatListModule} from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TutoriasRoutingModule } from './tutorias-routing.module';

import { RiesgoAdacemicoComponent } from './riesgo-adacemico/riesgo-adacemico.component';

@NgModule({
  declarations: [RiesgoAdacemicoComponent],
  imports: [
    CommonModule,
    TutoriasRoutingModule,
    MatStepperModule,
    MatTooltipModule,
    MatListModule,
    MatDividerModule,
    MatSelectModule,
    MatPaginatorModule,
    MatOptionModule,
    MatDatepickerModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule, 
    MatButtonToggleModule,
    MatInputModule,
    MatMenuModule,
    MatSnackBarModule
  ]
})

export class TutoriasModule { }
