import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AsistenciaEventoExternoComponent } from './asistencia-evento-externo/asistencia-evento-externo.component';
import { RegistroEventoExternoComponent } from './registro-evento-externo/registro-evento-externo.component';

const routes: Routes = [
  {
    path: '',
    component: AsistenciaEventoExternoComponent,
  },
  {
    path: 'registrarse',
    component: RegistroEventoExternoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventosRoutingModule { }
