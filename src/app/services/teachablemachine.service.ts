import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Esto lo registra automáticamente como un proveedor global.
})

export class TeachablemachineService {

  private URL = "https://teachablemachine.withgoogle.com/models/IFudgWEX4/"
  private model: any;
  private classLabels: string[] = [];


  constructor() { }


  async loadModel() {
      try {
          const modelURL = this.URL + 'model.json';
          const metadataURL = this.URL + 'metadata.json';

          const tmImage = (window as any).tmImage;
          this.model = await tmImage.load(modelURL, metadataURL);
          this.classLabels = this.model.getClassLabels();

      } catch (error) {
          console.error('Error al cargar el modelo:', error);
          throw new Error('No se pudo cargar el modelo.');
      }
  }

  getClassLabels(): string[] {
      return this.classLabels;
  }

    /* Método para la predicción a partir de la imagen */
    async predict(imageElement: HTMLImageElement): Promise<any[]> {
      if (!this.model) {
          throw new Error('El modelo no está cargado.');
      }

      return await this.model.predict(imageElement);
    }
}
