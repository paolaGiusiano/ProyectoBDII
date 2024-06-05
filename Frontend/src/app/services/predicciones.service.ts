/*import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    return this.http.post(`${this.baseUrl}/predictions`, prediction);
  }

}
*/

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError  } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PrediccionesService {
  private baseUrl = 'http://localhost:3000'; // URL base de tu backend

  constructor(private http: HttpClient) { }

  getUpcomingMatches(): Observable<any> {
    return this.http.get(`${this.baseUrl}/matches/upcoming`);
  }

  submitMatchPrediction(prediction: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/predictions`, prediction);
  }
 
  submitTournamentPrediction(predictionData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/championship-predictions`, predictionData);
  }

  getPredictions(documento: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/predictions/${documento}`);
  }

  getTorneoPrediction(documento: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/tournament-prediction/${documento}`);
  }

  deletePrediction(id_prediccion: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/predictions/${id_prediccion}`);
  }

  //modificar/actualizar una prediccion
  updatePrediction(predictionData: any): Observable<any> {
    const url = `${this.baseUrl}/predictions/${predictionData.id}`;
    return this.http.put(url, predictionData);
  }
 
 
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '¡Error desconocido!';
    if (error.error instanceof ErrorEvent) {
      // Errores del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Errores del lado del servidor
      errorMessage = `Código de Error: ${error.status}\nMensaje: ${error.message}`;
    }
    return throwError(errorMessage);
  }

}
