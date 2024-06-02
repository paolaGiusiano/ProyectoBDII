import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrediccionesService {

  private baseUrl = 'http://localhost:3000'; // URL base de tu backend

  constructor(private http: HttpClient) { }

 
  getUpcomingMatches(): Observable<any> {
    return this.http.get(`${this.baseUrl}/matches/upcoming`);
  }

  submitPrediction(prediction: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/predicciones`, prediction);
  }

}
