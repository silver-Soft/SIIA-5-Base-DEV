import { AfterViewInit, Component, ElementRef, Inject, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'src/app/modules/servicios/core/notification.service';

export interface DialogData {
  titulo:string,
}

@Component({
  selector: 'app-tomar-foto',
  templateUrl: './tomar-foto.component.html',
  styleUrls: ['./tomar-foto.component.css'],
  styles:[`
    ::ng-deep .mat-dialog-container {
      box-shadow: 0px 11px 15px -7px rgba(255, 255, 255, 0), 0px 24px 38px 3px rgba(255, 255, 255, 0), 0px 9px 46px 8px rgba(255, 255, 255, 0);
      background: transparent;
      color: rgba(0,0,0,.87);
      padding: 0px;
    },
    ::ng-deep .mat-mdc-dialog-container .mdc-dialog__surface {
      background-color:transparent !important;
    }
  `] 
})
export class TomarFotoComponent implements AfterViewInit, OnDestroy{
  @ViewChild('video') video: ElementRef<HTMLVideoElement>;
  videoStream: MediaStream | null = null;
  selectedImage: any;
  videoElement: HTMLVideoElement;
  constructor(
    private _notificationService: NotificationService,
    private ngZone: NgZone,
    public dialogRef: MatDialogRef<TomarFotoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngAfterViewInit(): void {
    this.openCamera()      
  }  

  ngOnDestroy(): void {
    this.closeCamera();
  }

  captureImage(): void {
    const videoElement = this.video.nativeElement;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    if (ctx) {
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      const img = new Image();
      img.src = canvas.toDataURL('image/jpeg', 0.5);
      img.onload = () => {
        this.ngZone.run(() => {
          const croppedDataUrl = this.cropImageToSquare(img);
          this.selectedImage = croppedDataUrl;
          this.closeCamera()
          this.dialogRef.close({data:this.selectedImage});
        });
      };
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

  openCamera(): void {
    const video = this.video.nativeElement;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          this.videoStream = stream; // Guardar la referencia al stream
          video.srcObject = stream;
          video.play();
        })
        .catch(err => {
          console.error('Error accessing webcam:', err);
          this.handleCameraError(err); // Manejar el error y notificar al usuario
        });
    } else {
      this._notificationService.pushError("La API de dispositivos de medios no está disponible en su navegador.",5000)      
      this.onNoClick()
    }
  }
  
  handleCameraError(error: any): void {
    let errorMessage = 'Ocurrió un error al intentar acceder a la cámara.';
    if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      errorMessage = 'No se encontró ninguna cámara en su dispositivo.';
    } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      errorMessage = 'El acceso a la cámara ha sido denegado.';
    } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      errorMessage = 'La cámara está en uso o no se puede acceder.';
    }     
    this._notificationService.pushError(errorMessage,5000)
    this.onNoClick()
  }
  
  closeCamera(): void {
    if (this.videoStream) {
      const tracks = this.videoStream.getTracks();
      tracks.forEach(track => track.stop());
      this.videoStream = null;
    }
  }
  
  onNoClick(): void {    
    this.closeCamera()
    this.dialogRef.close();
  }
}
