import { HttpHeaders } from '@angular/common/http';

export class AppSettings {

    public static env ="siia"//siiadsyti | siia
    public static API_ENDPOINT = 'https://'+AppSettings.env+'.uatx.mx:8743';
    public static API_ENDPOINT_AVISOS= 'https://'+AppSettings.env+'.uatx.mx:8743/siia-back-avisos-0.0.1-SNAPSHOT'
    public static API_ENDPOINT_TUTORIAS = 'https://'+AppSettings.env+'.uatx.mx:8743/siia-back-tutorias-tesis-0.0.1-SNAPSHOT';
    
    public static TITLE = 'SIIA 5';
    public static SLOGAN = 'Sistema integral de información administrativa';
    public static COPYRIGHT = 'Copyright © 2022 - Todos los derechos reservados';

    public static TOKEN_USER = "token";
    public static LOGGED_USER = "loggedUser";
    public static OPTIONS_LOGGED_USER = "optionsLoggedUser";

   
    public static CODE_LOST_REQUEST = 0;
    public static CODE_WRONG_REQUEST = 400;
    public static CODE_WITHOUT_AUTHORIZATION = 401;
    public static CODE_OK = 200;

    public static HEADERS = {
        headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Access-Control-Allow-Credentials' : 'true',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, PUT, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
          })
    };

    
    public static getTypeMessageByCode(code: number): string {
        let type_message: string;
        
        switch (code) {
            case 301:
                type_message = 'alert-warning';
                break;
            case 200:
                type_message = 'alert-success';
                break;
            case 500:
                type_message = 'alert-danger';
                break;
            default:
                type_message = 'alert-warning';
                break;
        }
        return type_message;

    }


    public static getTypeMessageByCodeSeverity(code: number): string {
        let type_message: string;
        switch (code) {
            case 1:
                type_message = 'alert-success';
                break;
            case 2:
                type_message = 'alert-warning';
                break;
            case 3:
                type_message = 'alert-danger';
                break;
            default:
                type_message = 'alert-warning';
                break;
        }
        return type_message;

    }



}
