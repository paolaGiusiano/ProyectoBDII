import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
 
  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) { }

  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/notifications`);
  }

  // Método para enviar correo antes del partido
  enviarCorreoAntesPartido(partido: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/enviar-correo-partido`, { partido });
  }



}
