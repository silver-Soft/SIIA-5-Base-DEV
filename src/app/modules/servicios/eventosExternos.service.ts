import { Injectable, numberAttribute } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { NotificationService } from "./core/notification.service";
import { AppSettings } from 'src/app/settings.const';
import { Observable, catchError, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AsistenteEventoModel } from '../componentes/models/asistenteEventoModel';
import { AsistenciaModel } from '../componentes/models/asistenciaModel';

@Injectable({
  providedIn: 'root'
})

export class EventosExternosService {
  constructor(private https: HttpClient, protected _notificationService: NotificationService,
    private _translate: TranslateService) { }

  obtTiposAsistente() {
    const Body = { strUsuarioAudit: null };
    return this.https.post(
      AppSettings.API_ENDPOINT_EVENTOS_EXTERNOS + '/public/eventosExternos/obtTiposParticipantes',
      Body
    ).pipe(
      catchError(error => {
        console.log(error);
        return this.handleError(error);
      })
    );
  }

  obtEventosExternos() {
    const Body = { strUsuarioAudit: null };
    return this.https.post(
      AppSettings.API_ENDPOINT_EVENTOS_EXTERNOS + '/public/eventosExternos/obtEventosExternos',
      Body
    ).pipe(
      catchError(error => {
        console.log(error);
        return this.handleError(error);
      })
    );
  }

  guardarAsistenteEventoExterno(Body: AsistenteEventoModel) {
    return this.https.put(AppSettings.API_ENDPOINT_EVENTOS_EXTERNOS + '/public/eventosExternos/guardarAsistenteEventoExterno',
      Body
    ).pipe(
      catchError(error => {
        console.log(error);
        return this.handleError(error);
      })
    ).pipe(
      catchError(error => {
        console.log(error);
        return this.handleError(error);
      })
    );
  }

  generarGafete(lngIdAsistenteEventoExterno: number) {
    const Body = {
      strUsuarioAudit: null,
      lngIdAsistenteEventoExterno: lngIdAsistenteEventoExterno
    }
    return this.https.post(AppSettings.API_ENDPOINT_EVENTOS_EXTERNOS + '/public/eventosExternos/generarGafete',
      Body
    ).pipe(
      catchError(error => {
        console.log(error);
        return this.handleError(error);
      })
    ).pipe(
      catchError(error => {
        console.log(error);
        return this.handleError(error);
      })
    );
  }

  valConfirmacionCorreo(lngIdAsistenteEventoExterno: number) {
    const Body = { strUsuarioAudit: null, lngIdAsistenteEventoExterno: lngIdAsistenteEventoExterno };
    return this.https.post(
      AppSettings.API_ENDPOINT_EVENTOS_EXTERNOS + '/public/eventosExternos/valConfirmacionCorreo',
      Body
    ).pipe(
      catchError(error => {
        console.log(error);
        return this.handleError(error);
      })
    );
  }

  obtenerConsultaDocAccesoFisicox(cadenaQR:string){ 
    var Body ={strLogin : sessionStorage.getItem('strLoginUsuarioLog'), intIdAccesoFisicoArea : 31, strCadenaQr : cadenaQR}   
    const headers = new HttpHeaders({'Access-Control-Allow-Origin': '*',
                                      'Content-Type': 'application/json',
                                      'Authorization': 'Basic ZnJvZXZlbDpQYSQkdzByZA=='});  
    return this.https.post(AppSettings.API_ENDPOINT_MOVILES +"/api/servicios/moviles/obtenerConsultaDocAccesoFisico",Body,{ headers: headers });
  }

  private apiUrl = 'https://siiadsyti.uatx.mx:8743/SIIAMOVIL/api/servicios/moviles/obtenerConsultaDocAccesoFisico';
  private headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Authorization': 'Basic ZnJvZXZlbDpQYSQkdzByZA==' // Encabezado de autorización estático
  });
  obtenerConsultaDocAccesoFisico2(cadenaQR:string): Observable<any> {
    var payload ={strLogin : sessionStorage.getItem('strLoginUsuarioLog'), intIdAccesoFisicoArea : 31, strCadenaQr : cadenaQR}   
    return this.https.post<any>(this.apiUrl, payload, { headers: this.headers });
  }

  guardarAsistenciaActividad(Body: AsistenciaModel) {
    return this.https.put(
      AppSettings.API_ENDPOINT_EVENTOS_EXTERNOS + 'api/eventosExternos/guardarAsistenciaActividad',
      Body
    ).pipe(
      catchError(error => {
        console.log(error);
        return this.handleError(error);
      })
    );
  }

  protected handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      this._notificationService.pushError(this._translate.instant('template.notificaciones.error.comunicacion'));
    } else {
      if (error.status === AppSettings.CODE_WRONG_REQUEST) {
        this._notificationService.pushError(this._translate.instant('template.notificaciones.error.solicitudErronea'));
      } else if (error.status === AppSettings.CODE_WITHOUT_AUTHORIZATION) {
        this._notificationService.pushError(this._translate.instant('template.notificaciones.error.solicitudNoAutorizada'));
      } else {
        this._notificationService.pushError(this._translate.instant('template.notificaciones.error.intentaloMasTarde'));
        this._notificationService.pushMsjResponse(error.error.lstMensajes);
      }
    }

    return throwError('ERROR');
  }

}