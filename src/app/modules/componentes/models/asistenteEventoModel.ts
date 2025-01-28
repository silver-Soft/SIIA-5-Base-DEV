export class AsistenteEventoModel {
    lngIdAsistenteEventoExterno: any;
    strNbAsistente: string;
    strPrimerApellido: string;
    strSegundoApellido: string;
    strCurp: string;
    btFoto: string | ArrayBuffer | null = null;
    strCorreo: string;
    strUsuarioAudit: any;
    intClEstatusValidacionCorreo: number;
    strCadenaVerificacion: any;
    intIdEventoExterno: number;

    strTipoAsistente:string;
    strCct:string;
    strNbPuestoAsistente:string;
    strNbCurso:string;

    constructor() {
        this.lngIdAsistenteEventoExterno = null;
        this.strNbAsistente = "";
        this.strPrimerApellido = "";
        this.strSegundoApellido = "";
        this.strCurp = "";
        this.btFoto = "";
        this.strCorreo = "";
        this.strUsuarioAudit = "";
        this.intClEstatusValidacionCorreo = 2;
        this.strCadenaVerificacion = "";
        this.intIdEventoExterno = 0;

        this.strTipoAsistente = "";
        this.strCct = "";
        this.strNbPuestoAsistente = "";
        this.strNbCurso = "";
    }
}