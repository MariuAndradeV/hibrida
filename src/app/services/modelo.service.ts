import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DetectionService {
  private apiUrl = 'https://your-service-name.onrender.com/detect/'; // URL del backend

  constructor(private http: HttpClient) {}

  detectObjects(image: File) {
    const formData = new FormData();
    formData.append('file', image);
    return this.http.post(this.apiUrl, formData);
  }
}
