import { Component, signal, ViewChild, ElementRef } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule

import { IonHeader, IonToolbar, IonTitle, IonContent, IonCardContent, IonButton, IonList, IonItem, IonLabel, IonFab, IonFabButton, IonIcon, IonCard, IonCardHeader, IonCardTitle     } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

/* Importe la función y el ícono */
import { addIcons } from 'ionicons';
import { cloudUploadOutline } from 'ionicons/icons';

/* Importe HttpClient para hacer solicitudes HTTP */
import { HttpClient } from '@angular/common/http';

/* Importe el pipe */
import { PercentPipe } from '@angular/common';

import { CommonModule } from '@angular/common'; // Importa CommonModule
import { RecipeService } from '../services/recipe.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [HttpClientModule, CommonModule,IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, IonFab, IonFabButton, IonIcon, IonCard, IonCardContent, IonButton, IonList, IonItem, IonLabel, PercentPipe, IonCardHeader, IonCardTitle],
})

export class Tab1Page {


  imageFile: File | null = null;

  @ViewChild('image', { static: false }) imageElement!: ElementRef<HTMLImageElement>;

  imageReady = signal(false);
  imageUrl = signal("");

  loading = signal(false);

  /* URL del backend */
  private apiUrl = 'https://cookfinderbackend.onrender.com/detect/'; // Cambia a tu URL del backend

  /* Lista de predicciones */
  predictions: any[] = [];

  constructor(private http: HttpClient, private recipeService: RecipeService) {
    addIcons({ cloudUploadOutline });
  }

  /* Método para manejar la selección de un archivo */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
      console.log(this.imageFile);

      const reader = new FileReader();

      // Convertir el archivo a una URL base64 para mostrarlo en el HTML
      reader.onload = () => {
        this.imageUrl.set(reader.result as string);
        this.imageReady.set(true);
      };

      reader.readAsDataURL(this.imageFile); // Leer el archivo como base64
    }
  }


  /* Método para enviar la imagen al backend y obtener predicciones */
  predict(): void {
    console.log("Llamando a la nube")

    if (!this.imageFile) {
      alert('Primero debes cargar una imagen.');
      return;
    }

    this.loading.set(true)

    const formData = new FormData();
    formData.append('file', this.imageFile);

    this.http.post<{ detections: any[] }>(this.apiUrl, formData).subscribe(
      (response) => {
        this.predictions = response.detections;
        console.log('Predicciones:', this.predictions);

        // Generar la receta automáticamente después de obtener las predicciones
        if (this.predictions.length > 0) {
          this.generateRecipe();
        }
        this.loading.set(false);
      },
      (error) => {
        console.error('Error al realizar la predicción:', error);
        alert('Hubo un problema al conectarse al servidor.');
      }
    );
  }

  recipe: string = ''; // Variable para almacenar la receta generada

  /* Método para generar la receta */
  generateRecipe(): void {
    if (this.predictions.length === 0) {
      alert('Primero debes cargar una imagen y obtener predicciones.');
      return;
    }

    const ingredients = this.predictions.map((pred) => pred.class); // Obtener los ingredientes de las predicciones
    const requestBody = { ingredients };

    this.http.post<{ recipe: string }>('https://cookfinderbackend.onrender.com/generate-recipe/', requestBody).subscribe(
      (response) => {
        this.recipe = response.recipe.replace(/\*\*/g, '');

        console.log('Receta generada:', this.recipe);
      },
      (error) => {
        console.error('Error al generar la receta:', error);
        alert('Hubo un problema al conectarse al servidor.');
      }
    );
  }

   guardarReceta(): void {
    if (this.recipe) {
      this.recipeService.addRecipe(this.recipe);
      alert('Receta guardada en el historial.');
    } else {
      alert('No hay receta para guardar.');
    }
  }

}
