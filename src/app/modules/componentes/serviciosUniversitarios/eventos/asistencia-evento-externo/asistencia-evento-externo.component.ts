import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
//import { Result } from '@zxing/library';
import { ZXingScannerComponent } from '@zxing/ngx-scanner'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from 'src/app/modules/servicios/core/notification.service'; 
import { EventosExternosService } from 'src/app/modules/servicios/eventosExternos.service';
import { AsistenciaModel } from '../../../models/asistenciaModel';

@Component({
  selector: 'app-asistencia-evento-externo',
  templateUrl: './asistencia-evento-externo.component.html',
  styleUrls: ['./asistencia-evento-externo.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AsistenciaEventoExternoComponent {
  title = 'qr-scanner-app';
  qrResultString: any = null;
  @ViewChild('scanner') scanner: ZXingScannerComponent;
  
  constructor(private snackBar: MatSnackBar,
    private _notificationService: NotificationService,
    private eventosExternosService: EventosExternosService,
  ) {}  

  ngAfterViewInit(): void {
    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      if (devices && devices.length > 0) {
        this.scanner.device = devices[0];
      } else {
        this.notifyUser('No se encontraron cámaras.');
      }
    });

    this.scanner.camerasNotFound.subscribe(() => {
      this.notifyUser('No se encontraron cámaras.');
    });

    this.scanner.permissionResponse.subscribe((hasPermission: boolean) => {
      if (!hasPermission) {
        this.notifyUser('El acceso a la cámara ha sido denegado.');
      }
    });
  }  

  onCodeResult(resultString: string): void {
    this.qrResultString = resultString;
    this._notificationService.pushSuccess("Asistente registrado",3000,'top')
    let qr = this.qrResultString.split('q=')[1];
    this.obtenerConsultaDocAccesoFisico2(qr)     
  }

  test(){
    let qr = "35EED270E18CC2DB3E316955A85BBA6E9C734875585020858773982039F28DA8"//this.qrResultString.split('q=')[1];
    this.obtenerConsultaDocAccesoFisico2(qr)
  }

  async obtenerConsultaDocAccesoFisico2(cadenaQR:string) {
    await this.eventosExternosService.obtenerConsultaDocAccesoFisico2(cadenaQR).subscribe({        
      next: data => { 
        var response : any  = data
        if(response.length>0){
          let asistencia = new AsistenciaModel()

          asistencia.lngIdAsistenciaActividad = null
          asistencia.lngIdAsistenteEventoExterno = response[0].lngIdVisitante
          asistencia.lngIdActividadEventoExterno = null          
          asistencia.fcInicioAsistencia = new Date().getTime()
          asistencia.strUsuarioAudit = sessionStorage.getItem("strLoginUsuarioLog")
          
          console.log(JSON.stringify(asistencia))
          //this.registrarAsistencia(asistencia)
        }else{
          if(response.lstMensajesValidacion.length>0){
            this._notificationService.pushAlert(response.lstMensajesValidacion[0].mensaje,5000)
          }else{
            this._notificationService.pushAlert("No se realizó el registro, intente nuevamente.",5000)
          }
        }
      },
      error: error => {          
          this._notificationService.pushError("Ha ocurrido un error, vuelva a intentarlo más tarde") 
      }
    });    
    console.log(this.qrResultString)
    //this.registrarAsistencia(asistencia)
    /*setTimeout(() => {
      this.clearResult()
    }, 3000);*/
  }

  async registrarAsistencia(nuevaAsistencia:AsistenciaModel) {
    await this.eventosExternosService.guardarAsistenciaActividad(nuevaAsistencia).subscribe({        
      next: data => { 
        var response : any = data
        if(response.blnValido){
          if(response.lstMensajes.length>0){
            this._notificationService.pushSuccess(response.lstMensajes[0].mensaje,3000)
          }else{
            this._notificationService.pushSuccess("¡Registro exitoso!",3000)
          }
        }else{
          if(response.lstMensajesValidacion.length>0){
            this._notificationService.pushAlert(response.lstMensajesValidacion[0].mensaje,5000)
          }else{
            this._notificationService.pushAlert("No se realizó el registro, intente nuevamente.",5000)
          }
        }
      },
      error: error => {          
          this._notificationService.pushError("Ha ocurrido un error, vuelva a intentarlo más tarde") 
      }
    });
  }

  clearResult(): void {
    this.qrResultString = null;
  }

  notifyUser(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 8000, // Duración del snackbar en milisegundos
    });
  }
}
