import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

import { EventosRoutingModule } from './eventos-routing.module';

import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { AsistenciaEventoExternoComponent } from './asistencia-evento-externo/asistencia-evento-externo.component';
import { RegistroEventoExternoComponent } from './registro-evento-externo/registro-evento-externo.component';
import { TomarFotoComponent } from '../../modal-dialogs/tomar-foto/tomar-foto.component';
@NgModule({
  declarations: [AsistenciaEventoExternoComponent, RegistroEventoExternoComponent,TomarFotoComponent],
  imports: [
    CommonModule,
    MatSelectModule,
    MatInputModule,
    EventosRoutingModule,
    ZXingScannerModule,
    FormsModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatOptionModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule
  ]
})
export class EventosModule { }
