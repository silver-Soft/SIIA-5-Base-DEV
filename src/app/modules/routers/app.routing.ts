import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from "../servicios/core/auth-guard.service";

//LOGIN
import { LoginComponent } from '../componentes/login/login.component';
import { HomeComponent } from '../componentes/home/home.component';
import { RegistroEventoExternoComponent } from '../componentes/serviciosUniversitarios/eventos/registro-evento-externo/registro-evento-externo.component';

const routes: Routes = [
  //{ path: "", redirectTo: 'login', pathMatch: "full"},
  { path: "", redirectTo: 'registrarse', pathMatch: "full"},  
  { path: "registrarse", component: RegistroEventoExternoComponent, pathMatch: "full"},
  { path: "login", component: LoginComponent, pathMatch: "full"},
  { path: "inicio", component: HomeComponent, pathMatch: "full", canActivate:[AuthGuardService]}, //canActivate: [AuthGuardService]   
  
  {
    path: 'tutorias-riesgoAcademico',
    loadChildren: () => import('../componentes/serviciosEstudiantiles/tutorias/tutorias.module').then(m => m.TutoriasModule),
    canActivate: [AuthGuardService]
  },

  {
    path: 'asistenciaEventoExterno',
    loadChildren: () => import('../componentes/serviciosUniversitarios/eventos/eventos.module').then(m => m.EventosModule),
    canActivate: [AuthGuardService]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { };
