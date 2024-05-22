import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/settings.const';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { NotificationService } from './core/notification.service';
import { catchError, Observable, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class RiesgoAcademicoService {
  token = sessionStorage.getItem('token');
  strLoginUsuarioLog = sessionStorage.getItem('strLoginUsuarioLog');

  constructor(
    private http: HttpClient,
    protected _notificationService: NotificationService,
    private _translate: TranslateService
  ) { }

  obtPeriodos = () => {
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + this.token });
    return this.http
      .get(
        AppSettings.API_ENDPOINT_TUTORIAS +'/api/tutorias/obtPeriodos', { headers: headers }
        )
      .pipe(
        catchError((error) => {
          console.log(error);
          return this.handleError(error);
        })
      );
  };

  obtProgramas() {
    var body = {
      strUsuario: this.strLoginUsuarioLog
    };
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + this.token });
    return this.http
      .post(
        AppSettings.API_ENDPOINT_TUTORIAS + '/api/tutorias/obtProgramas',body,
        { headers: headers }
      )
      .pipe(
        catchError((error) => {
          console.log(error);
          return this.handleError(error);
        })
      );
  }

  buscarTutores(body:any) {
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + this.token });
    return this.http
      .post(
        AppSettings.API_ENDPOINT_TUTORIAS + '/api/tutorias/buscarTutores',body,
        { headers: headers }
      )
      .pipe(
        catchError((error) => {
          console.log(error);
          return this.handleError(error);
        })
      );
  }

  verTutorados(body:any) {
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + this.token });
    return this.http
      .post(
        AppSettings.API_ENDPOINT_TUTORIAS + '/api/tutorias/verTutorados',body,
        { headers: headers }
      )
      .pipe(
        catchError((error) => {
          console.log(error);
          return this.handleError(error);
        })
      );
  }

  obtEstatusRiesgoAcademico(body:any) {
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + this.token });
    return this.http
      .post(
        AppSettings.API_ENDPOINT_TUTORIAS + '/api/tutorias/obtEstatusRiesgoAcademico',body,
        { headers: headers }
      )
      .pipe(
        catchError((error) => {
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
