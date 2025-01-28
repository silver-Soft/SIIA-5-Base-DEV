import { Component, OnInit,ChangeDetectionStrategy, NgZone, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/modules/servicios/core/notification.service'; 
import { TomarFotoComponent } from '../../../modal-dialogs/tomar-foto/tomar-foto.component'; 
import { AsistenteEventoModel } from '../../../models/asistenteEventoModel';
import { EventosExternosService } from 'src/app/modules/servicios/eventosExternos.service';
import { DomSanitizer } from '@angular/platform-browser';
import { VisorArchivoModalComponent } from '../../../modal-dialogs/visor-archivo-modal/visor-archivo-modal.component';

@Component({
  selector: 'app-registro-evento-externo',
  templateUrl: './registro-evento-externo.component.html',
  styleUrls: ['./registro-evento-externo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistroEventoExternoComponent implements OnInit{

  tipoRegistroFormGroup: FormGroup  
  esDispositivoMovil: boolean;
  selectedImage: string | ArrayBuffer | null = null;
  isWebcamActive: boolean = false;
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  @ViewChild('cameraInput') cameraInput: ElementRef<HTMLInputElement>;
  //@ViewChild('video') video: ElementRef<HTMLVideoElement>;

  listTipoAsistente: any[]=[]
  correoValido: boolean;
  enProceso:boolean=false
  lngIdAsistenteEventoExterno: any;
  esAsistente: boolean = false;
  idAsistente: any=0;
  constructor(
    public _dialog: MatDialog,
    private ngZone: NgZone,
    private _sanitizer: DomSanitizer,
    private observer : BreakpointObserver,
    private _formBuilder: FormBuilder,
    private _notificationService: NotificationService,
    private eventosExternosService: EventosExternosService,
    public dialog: MatDialog, public router: Router,
    private cdr: ChangeDetectorRef) { 
    }    
  
  ngOnInit(): void {  
    this.observer.observe(['(max-width: 800px)']).subscribe(result => {
      this.esDispositivoMovil = result.matches;
    });

    this.obtTiposAsistente()

    this.tipoRegistroFormGroup = this._formBuilder.group({
      tipoAsistente: new FormControl('', [Validators.required]),
      cct: new FormControl('', [Validators.nullValidator]),
      puesto: new FormControl('', [Validators.nullValidator]),
      nombreCurso: new FormControl('', [Validators.nullValidator]),

      nombre: new FormControl('', [Validators.required]),
      apellidoP: new FormControl('', [Validators.required]),
      apellidoM: new FormControl('', [Validators.required]),
      curp: new FormControl('', [Validators.required,this.curpValidator]),
      correo: new FormControl('', [Validators.required]),      
    });

    this.tipoRegistroFormGroup.get('tipoAsistente')!.valueChanges.subscribe((selectedValue: any) => {
      this.idAsistente = selectedValue
      console.log("this.idAsistente: "+this.idAsistente)   
      if(this.idAsistente == "PARTICIPANTE"){        
        this.esAsistente = true 
        console.log("selecciono asistente, es asistente: "+this.esAsistente)       
        this.tipoRegistroFormGroup.get('cct')!.setValidators(Validators.required)
        this.tipoRegistroFormGroup.get('puesto')!.setValidators(Validators.required)
        this.tipoRegistroFormGroup.get('nombreCurso')!.setValidators(Validators.nullValidator)        

        this.tipoRegistroFormGroup.get('cct')!.updateValueAndValidity();
        this.tipoRegistroFormGroup.get('puesto')!.updateValueAndValidity();
        this.tipoRegistroFormGroup.get('nombreCurso')!.updateValueAndValidity();

      }else if(this.idAsistente="PONENTE"){        
        this.esAsistente = false
        console.log("selecciono ponente, es asistente: "+this.esAsistente)
        this.tipoRegistroFormGroup.get('cct')!.setValidators(Validators.nullValidator)
        this.tipoRegistroFormGroup.get('puesto')!.setValidators(Validators.nullValidator)
        this.tipoRegistroFormGroup.get('nombreCurso')!.setValidators(Validators.required)        

        this.tipoRegistroFormGroup.get('cct')!.updateValueAndValidity();
        this.tipoRegistroFormGroup.get('puesto')!.updateValueAndValidity();
        this.tipoRegistroFormGroup.get('nombreCurso')!.updateValueAndValidity();
      }
    });

  }

  async registrarEventoExterno(f:any){
    if(f.valid){
      if(this.selectedImage != null){
        let asistenteEventoModel = new AsistenteEventoModel()
        let carga = this.tipoRegistroFormGroup.value
        let crop = this.selectedImage.toString().indexOf(",");
        var base64 = this.selectedImage.toString().substr(crop+1, this.selectedImage.toString().length)

        asistenteEventoModel.intIdEventoExterno = 0
        asistenteEventoModel.strNbAsistente = carga.nombre
        asistenteEventoModel.strPrimerApellido = carga.apellidoP
        asistenteEventoModel.strSegundoApellido = carga.apellidoM
        asistenteEventoModel.strCurp = carga.curp        
        asistenteEventoModel.strCorreo = carga.correo
        asistenteEventoModel.btFoto = base64        
        asistenteEventoModel.strUsuarioAudit = null
        asistenteEventoModel.intClEstatusValidacionCorreo = 2
        asistenteEventoModel.strCadenaVerificacion = null 
        asistenteEventoModel.intIdEventoExterno = 1//carga.evento

        asistenteEventoModel.strTipoAsistente = carga.tipoAsistente;
        
        if(carga.tipoAsistente=="PARTICIPANTE"){
          asistenteEventoModel.strCct = carga.cct;
          asistenteEventoModel.strNbPuestoAsistente = carga.puesto;
        }else if(carga.tipoAsistente=="PONENTE"){
          asistenteEventoModel.strNbCurso = carga.nombreCurso;
        }        
        //console.log(JSON.stringify(asistenteEventoModel))               
        this.guardarRegistro(asistenteEventoModel)
      }else{
        this._notificationService.pushAlert("Cargue una foto o seleccione una imagen",3000)
      }
    }else{
      this._notificationService.pushError("Ingrese los campos requeridos",5000)
    }    
  }  

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          this.ngZone.run(() => {
            const croppedDataUrl = this.cropImageToSquare(img); // Recorta la imagen al centro con un formato cuadrado
            this.selectedImage = croppedDataUrl;
            this.cdr.detectChanges(); // Fuerza la detección de cambios
          });
        };
      };
      reader.readAsDataURL(file);
    }
  }

  cropImageToSquare(img: HTMLImageElement): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const sideLength = Math.min(img.width, img.height); // Tamaño del lado del cuadrado
    const startX = (img.width - sideLength) / 2; // Coordenada X de inicio para el recorte
    const startY = (img.height - sideLength) / 2; // Coordenada Y de inicio para el recorte

    canvas.width = sideLength;
    canvas.height = sideLength;

    if (ctx) {
      ctx.drawImage(img, startX, startY, sideLength, sideLength, 0, 0, sideLength, sideLength);
    }

    return canvas.toDataURL('image/jpeg', 0.5); // Ajusta la calidad a un valor más bajo
  }

  openWebcam(): void {
    var dimen="40%"    
    const dialogRef = this._dialog.open(TomarFotoComponent, {
      data: {
        titulo:"Capturar fotografía",        
      },  
      height: 'auto',
      width: dimen        
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result!=undefined){
        if (result.data!= undefined && result.data != null) {
          this.selectedImage = result.data;
          this.cdr.detectChanges();
        }
      }      
    });    
  }

  async guardarRegistro(asistenteEventoModel:AsistenteEventoModel){          
    /*let response:any = {}
      if(response.blnValido){
        this._notificationService.pushSuccess("Se ha registrado correctamente, Revisa tu correo electrónico para continuar con la verificación.",6000)
        this.enProceso=true
        this.lngIdAsistenteEventoExterno = response.objeto.lngIdAsistenteEventoExterno

        this.selectedImage = null
        this.tipoRegistroFormGroup.reset()                
        Object.keys(this.tipoRegistroFormGroup.controls).forEach(key => {
          this.tipoRegistroFormGroup.get(key)!.setErrors(null);
          this.tipoRegistroFormGroup.get(key)!.markAsUntouched();
          this.tipoRegistroFormGroup.get(key)!.markAsPristine();
        });
        
      }else{
        if(response.objetoExtraDos){
          this.enProceso=true
          this.lngIdAsistenteEventoExterno = response.objetoExtraDos

          var result = await this._notificationService.pedirConfirmacion(response.lstMensajesValidacion.length>0?
            response.lstMensajesValidacion[0].mensaje:
            "Ya se encuentra registrado en el evento.",
            "Desea reenviar el correo de confirmación?"
          )
          if(result==true){
            this._notificationService.pushSuccess("Reenviar correo pendiente",3000)
          }else{
            
          }
        }else{
          if(response.lstMensajesValidacion.length>0){
            this._notificationService.pushAlert(response.lstMensajesValidacion[0].mensaje,5000)
          }else{
            this._notificationService.pushError("¡Ocurrio un error al procesar tu petición. intente nuevamente o contacte al personal de la UAT!",5000)
          }   
        }       
      }
    */
    await this.eventosExternosService.guardarAsistenteEventoExterno(asistenteEventoModel).subscribe({        
      next: async data => { 
        var response : any = data
        
        if(response.blnValido){
          this._notificationService.pushSuccess("Se ha registrado correctamente, Revisa tu correo electrónico para continuar con la verificación.",6000)
          this.enProceso=true
          this.lngIdAsistenteEventoExterno = response.objeto.lngIdAsistenteEventoExterno
          
          this.resetForm()
        }else{
          if(response.objetoExtraDos){
            this.enProceso=true
            if(response.objeto?.strCorreo){
              this.lngIdAsistenteEventoExterno = response.objetoExtraDos

              var result = await this._notificationService.pedirConfirmacion(response.lstMensajesValidacion.length>0?
                response.lstMensajesValidacion[0].mensaje:
                "Ya se encuentra registrado en el evento.",
                "Un nuevo correo se ha enviado a "+response.objeto.strCorreo+", por favor verifique su bandeja de entrada y confirme su correo",
                false
              )
              if(result==true){
                this.resetForm()
              }    
            }else{
              this.lngIdAsistenteEventoExterno = response.objetoExtraDos
              var result2 = await this._notificationService.pedirConfirmacion(
                "Asistente registrado y confirmado.",
                "Este asistente ya se ha registrado y ha confirmado su correo, de clic en el botón aceptar para cerrar este dialogo y a continuación de clic en continuar para descargar su gafete.",
                false
              )              
            } 
            if(result2){
              this.cdr.detectChanges();
            }else{
              this.cdr.detectChanges();
            }                   
          }else{
            if(response.lstMensajesValidacion.length>0){
              this._notificationService.pushAlert(response.lstMensajesValidacion[0].mensaje,5000)
            }else{
              this._notificationService.pushError("¡Ocurrio un error al procesar tu petición. intente nuevamente o contacte al personal de la UAT!",5000)
            }   
          }       
        }
      },
      error: error => {          
          this._notificationService.pushError("Ha ocurrido un error, vuelva a intentarlo más tarde") 
      }
    });
  }

  resetForm() {
    this.selectedImage = null
    this.tipoRegistroFormGroup.reset()
    Object.keys(this.tipoRegistroFormGroup.controls).forEach(key => {
      this.tipoRegistroFormGroup.get(key)!.setErrors(null);
      this.tipoRegistroFormGroup.get(key)!.markAsUntouched();
      this.tipoRegistroFormGroup.get(key)!.markAsPristine();
    });
  }

  async continuar(){
    await this.eventosExternosService.valConfirmacionCorreo(this.lngIdAsistenteEventoExterno).subscribe({        
      next: data => { 
        var response : any = data
        if(response.blnValido){
          this.generarGafete()
        }else{
          if(response.lstMensajesValidacion.length>0){
            this._notificationService.pushAlert(response.lstMensajesValidacion[0].mensaje,5000)
          }else{
            this._notificationService.pushAlert("No se ha realizado la confirmación del correo",5000)
          }
        }
      },
      error: error => {          
          this._notificationService.pushError("Ha ocurrido un error, vuelva a intentarlo más tarde") 
      }
    });
  }

  async generarGafete(){//lngIdAsistenteEventoExterno
    await this.eventosExternosService.generarGafete(this.lngIdAsistenteEventoExterno).subscribe({        
      next: data => { 
        var response : any = data
        if(response.blnValido){
          this.visualizarArchivoX("Gaffete",response.objeto)
        }else{

        }
        //console.log("Response gafete \n"+JSON.stringify(response))
      },
      error: error => {          
          this._notificationService.pushError("Ha ocurrido un error, vuelva a intentarlo más tarde") 
      }
    });
  }

  visualizarArchivoX(nombreDoc:string,base64Doc:string) {
    var archivoMostrar = this._sanitizer.bypassSecurityTrustResourceUrl(  'data:application/pdf;base64,' + base64Doc);
    const dialogRef = this._dialog.open(VisorArchivoModalComponent, {
      maxWidth:'100vW',
      height:'100%',
      width: '80%',
      data: {
        nombre: nombreDoc,
        url: archivoMostrar,        
      },          
    });

  }

  QRTest(){
    this.router.navigate(['asistencia'],{
      //queryParams:{ filtro:this.filtro }
    })
  }

  regresar(){
    this.enProceso=false
    this.lngIdAsistenteEventoExterno = null
  }

  async obtTiposAsistente(){   
   await this.eventosExternosService.obtTiposAsistente().subscribe({        
      next: data => { 
        var info : any = data
        this.listTipoAsistente = info;
      },
      error: error => {          
          this._notificationService.pushError("Ha ocurrido un error, vuelva a intentarlo más tarde") 
      }
    });
  }

  triggerFileInput(type: 'files' | 'camera'): void {
    if (type === 'files') {
      this.fileInput.nativeElement.click();
    } else if (type === 'camera') {
      this.cameraInput.nativeElement.click();
    }
  }

  toUpperCase(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
    this.tipoRegistroFormGroup.get('curp')?.setValue(input.value);
  }

  revisarError = (formGroup: FormGroup, controlName: string, errorName: string) => {
    return formGroup.controls[controlName].hasError(errorName);
  }

  curpValidator(control: AbstractControl): { [key: string]: any } | null {
    const curpPattern = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z\d]{2}$/;
    const valid = curpPattern.test(control.value);
    return valid ? null : { 'invalidCurp': true };
  }
  
  validarCorreo(event:any): void{    
    const email = event?.target?.value ?? '';
    const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    this.correoValido = emailRegex.test(email);
    if(email==""){      
        this.tipoRegistroFormGroup.get('correo')?.setErrors({ 'required': true });
    }
    if(this.correoValido){      
      this.tipoRegistroFormGroup.get('correo')?.setErrors(null);
    }else{
      this.tipoRegistroFormGroup.get('correo')?.setErrors({ 'incorrecto': true });
    }
  }
}
