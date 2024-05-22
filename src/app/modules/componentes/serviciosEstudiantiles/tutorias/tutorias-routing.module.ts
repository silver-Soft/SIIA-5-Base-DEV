import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RiesgoAdacemicoComponent } from './riesgo-adacemico/riesgo-adacemico.component';

const routes: Routes = [
  {
    path: '',
    component: RiesgoAdacemicoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TutoriasRoutingModule { }
