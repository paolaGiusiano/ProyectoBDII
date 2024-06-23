import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PuntajeService {
  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  // Método para obtener los puntajes totales
  getPuntajesTotales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/score/puntajes-totales/`);
  }

  // Método para actualizar un puntaje total
  updatePuntajeTotal(documentoAlumno: string, puntajeTotal: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/score/puntajes-totales/${documentoAlumno}`, { puntaje_total: puntajeTotal });
  }

}
