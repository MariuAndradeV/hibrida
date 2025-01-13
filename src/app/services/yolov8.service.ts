import * as tf from '@tensorflow/tfjs';
import { Injectable } from '@angular/core';

interface DecodedResult {
  class: string;
  confidence: number;
  box: { x: number; y: number; width: number; height: number };
}

@Injectable({
  providedIn: 'root',
})
export class Yolov8Service {
  private model: tf.GraphModel | null = null;

  async loadModel(modelPath: string): Promise<void> {
    this.model = await tf.loadGraphModel(modelPath);
  }

  async predict(image: HTMLImageElement): Promise<DecodedResult[]> {
    if (!this.model) {
      throw new Error('Modelo no cargado.');
    }

    const tensor = tf.browser.fromPixels(image).toFloat().expandDims(0);
    const results = await this.model.executeAsync(tensor) as tf.Tensor[];

    tensor.dispose();
    results.forEach(res => res.dispose());

    return this.processResults(results);
  }

  private processResults(results: tf.Tensor[]): DecodedResult[] {
    const decodedResults: DecodedResult[] = [];

    // Ejemplo de decodificación (reemplazar con tu lógica real)
    results.forEach(result => {
      const classes = ['person', 'car', 'bicycle']; // Ejemplo de clases
      const confidence = Math.random(); // Ejemplo: Reemplaza con valores reales
      const box = { x: 0, y: 0, width: 100, height: 200 }; // Reemplazar con valores reales

      decodedResults.push({
        class: classes[0], // Ejemplo: la primera clase
        confidence: confidence,
        box: box,
      });
    });

    return decodedResults;
  }
}
