
import { Component, signal, ViewChild, ElementRef } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCardContent, IonButton, IonList, IonItem, IonLabel, IonFab, IonFabButton, IonIcon, IonCard } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

 /* Importe la función y el ícono */
 import { addIcons } from 'ionicons';
 import { cloudUploadOutline } from 'ionicons/icons';

 /* Importe el servicio */
 import { TeachablemachineService } from '../services/teachablemachine.service';

  /* Importe el pipe */
import { PercentPipe } from '@angular/common';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, IonFab, IonFabButton, IonIcon, IonCard, IonCardContent, IonButton, IonList, IonItem, IonLabel, PercentPipe ],
})

export class Tab1Page {
  /* Declare la referencia al elemento con el id image */
  @ViewChild('image', { static: false }) imageElement!: ElementRef<HTMLImageElement>;

  imageReady = signal(false)
  imageUrl = signal("")



    /* El método onSubmit para enviar los datos del formulario mediante el servicio */
    onFileSelected(event: Event): void {
      const input = event.target as HTMLInputElement;

      if (input.files && input.files.length > 0) {
          const file = input.files[0];
          console.log(file)

          const reader = new FileReader();

          // Convertir el archivo a una URL base64 para mostrarlo en el html
             reader.onload = () => {
              this.imageUrl.set(reader.result as string)
              this.imageReady.set(true)
          };

          reader.readAsDataURL(file); // Leer el archivo como base64
      }
  }

  /* Lista de predicciones */
  predictions: any[] = [];


  /* Método para obtener la predicción a partir de la imagen */
  async predict() {
      try {
          const image = this.imageElement.nativeElement;
          this.predictions = await this.teachablemachine.predict(image);
      } catch (error) {
          console.error(error);
          alert('Error al realizar la predicción.');
      }
  }
  

  /* Declare los atributos para almacenar el modelo y la lista de clases */
  modelLoaded = signal(false);
  classLabels: string[] = [];

  /* Registre el servicio en el constructor */
  constructor(private teachablemachine: TeachablemachineService) {              
    addIcons({ cloudUploadOutline });
  }

  /* Método ngOnInit para cargar el modelo y las clases */
  async ngOnInit() {
      await this.teachablemachine.loadModel()
      this.classLabels = this.teachablemachine.getClassLabels()
      this.modelLoaded.set(true)
  }

}
