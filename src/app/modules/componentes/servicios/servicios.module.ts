import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiciosRoutingModule } from './servicios-routing.module';
import { NuevoTicketComponent } from './nuevo-ticket/nuevo-ticket.component';


@NgModule({
  declarations: [
    NuevoTicketComponent
  ],
  imports: [
    CommonModule,
    ServiciosRoutingModule
  ]
})
export class ServiciosModule { }
