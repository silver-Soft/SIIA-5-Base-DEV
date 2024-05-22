import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicketAyudaComponent } from './ticket-ayuda/ticket-ayuda.component';

const routes: Routes = [
  {
    path: '',
    component: TicketAyudaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiciosRoutingModule { }
