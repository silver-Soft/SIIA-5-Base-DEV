import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { NotificationService } from "./core/notification.service";
import { AppSettings } from 'src/app/settings.const';
import { catchError, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})

export class EjemplosLlamadasDeApi {

  /**
   * La mayoría de las api proporcionadas por SISTEMAS deben recibir en los headers el token del login
   * 
   */
  token = sessionStorage.getItem("token");
  constructor(private https: HttpClient, protected _notificationService: NotificationService,
    private _translate: TranslateService) { }


  postExample(body: any) {
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.token });
    return this.https.post(
      AppSettings.API_BASEURL_EXAMPLE + '/endPoint"',
      body, { headers: headers }
    ).pipe(
      catchError(error => {
        console.log(error);
        return this.handleError(error);
      })
    );
  }

  getExample = () => {
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.token });
    return this.https
      .get(AppSettings.API_BASEURL_EXAMPLE + '/endPoint', {
        headers: headers,
      })
      .pipe(
        catchError((error) => {
          console.log(error);
          return this.handleError(error);
        })
      );
  };

  putExample(Body: any) {
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.token });
    return this.https.put(AppSettings.API_BASEURL_EXAMPLE + '/endPoint',
      Body, { headers: headers }).pipe(
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