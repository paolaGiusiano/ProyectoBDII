import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {
  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) { }

  getEstadisticas(carreraId?: string): Observable<any> {
    let url = `${this.apiUrl}/estadisticas`;
    if (carreraId) {
      url += `?id_carrera=${carreraId}`;
    }
    return this.http.get<any>(url);
  }

}
