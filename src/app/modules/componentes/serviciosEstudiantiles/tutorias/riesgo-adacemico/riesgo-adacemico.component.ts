import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from 'src/app/modules/servicios/core/notification.service';
import { RiesgoAcademicoService } from 'src/app/modules/servicios/riesgo-academico.service';

@Component({
  selector: 'app-riesgo-adacemico',
  templateUrl: './riesgo-adacemico.component.html',
  styleUrls: ['./riesgo-adacemico.component.css']
})
export class RiesgoAdacemicoComponent implements OnInit, AfterViewInit{
  esDispositivoMovil: boolean;

  listaRiesgo: any;
  datosRiesgo: any[]=[];

  periodosList: any[] = []
  programasList: any[] = []

  busqueda : any = {strUsuario:sessionStorage.getItem('strLoginUsuarioLog'),strIdPeriodo: 0, intIdProgramaCampus: 0}

  columnas2: string[] = [
    'strTutor', 'strTutorado', 'intSemestre', 'intNmMaterias', 'strRecurse', 
    'strBajoPromedio', 'strAltaReprobacion', 'strRezago', 'strCondicionado',
    'strSituacionRiesgo', 'intPromedioAnterior', 'intPromedio', 'intNmMateriasAnterior',
    'intMateriasBaja',
  ];
  solicitudesFormGroup: FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;  
  
  constructor(private _notificationService: NotificationService,
    private _formBuilder: FormBuilder,
    private observer: BreakpointObserver,
    private riesgoAcademicoService: RiesgoAcademicoService
  ) { 
    this.solicitudesFormGroup = this._formBuilder.group({
      periodo: ['', Validators.required],
      programa: ['', Validators.required],
    });
  }
  
  ngOnInit(): void {
    this.observer.observe(['(max-width : 800px)']).subscribe((res) => {      
      if (res.matches){
        this.esDispositivoMovil = true
      } else {
        this.esDispositivoMovil = false
      }
    });
    this.obtenerPeriodos()
    setTimeout(() => {
      this.obtenerProgramas()
      }, 300);    
  }

  ngAfterViewInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Solicitudes por página';
  }

  async obtenerPeriodos() {
    await this.riesgoAcademicoService.obtPeriodos().subscribe({             
      next: data => { 
        var response:any = data
        this.periodosList= response
      },
      error: error => {          
          this._notificationService.pushError("ha ocurrido un error al obtener los periodos, vuelva a intentarlo más tarde") 
      }
    }); 
  }

  async obtenerProgramas() {
    await this.riesgoAcademicoService.obtProgramas().subscribe({             
      next: data => { 
        var response:any = data
        this.programasList= response
      },
      error: error => {          
          this._notificationService.pushError("ha ocurrido un error al obtener los programas, vuelva a intentarlo más tarde") 
      }
    }); 
  }

  async buscarListaRiesgo(form: any) {
    if (form.valid) {
      console.log(JSON.stringify(this.busqueda))
      await this.riesgoAcademicoService.obtEstatusRiesgoAcademico(this.busqueda).subscribe({
        next: data => {
          this.listaRiesgo = []
          this.datosRiesgo = []
  
          var responseSolicitudes: any = data
          this.datosRiesgo = responseSolicitudes
  
          this.listaRiesgo = new MatTableDataSource<any>(this.datosRiesgo);
          this.listaRiesgo.paginator = this.paginator
          this.paginator._intl.itemsPerPageLabel = 'Solicitudes por página';
          this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
            const start = page * pageSize + 1;
            const end = (page + 1) * pageSize;
            return `${start} - ${end} de ${this.datosRiesgo.length}`;
          };
        },
        error: error => {
          this._notificationService.pushError("ha ocurrido un error al obtener los periodos, vuelva a intentarlo más tarde")
        }
      });
    }else{
      this._notificationService.pushError("Seleccione un programa y un periodo",3000)
    }
  }

  filtrarSolicitudes(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.listaRiesgo.filter = filtro.trim().toLowerCase();
  }

  revisarError(controlName: string, errorName: string): boolean {
    const control = this.solicitudesFormGroup.get(controlName);
    return control!! && control.hasError(errorName) ;
  }
}
