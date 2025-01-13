import { Component, signal, ViewChild, ElementRef } from '@angular/core';
import { Yolov8Service } from '../services/yolov8.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  @ViewChild('image', { static: false }) imageElement!: ElementRef<HTMLImageElement>;

  imageReady = signal(false);
  imageUrl = signal("");
  modelLoaded = signal(false);
  predictions: any[] = [];

  constructor(private yolov8Service: Yolov8Service) {}

  async ngOnInit() {
    await this.yolov8Service.loadModel('../src/app/services/prueba.py');
    this.modelLoaded.set(true);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl.set(reader.result as string);
        this.imageReady.set(true);
      };
      reader.readAsDataURL(file);
    }
  }

  async predict() {
    if (!this.imageElement || !this.modelLoaded()) {
      alert('Primero debes cargar una imagen y el modelo.');
      return;
    }

    try {
      const image = this.imageElement.nativeElement;
      this.predictions = await this.yolov8Service.predict(image);
      console.log(this.predictions);
    } catch (error) {
      console.error(error);
      alert('Error al realizar la predicción.');
    }
  }
}

