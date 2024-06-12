import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResultadoService {
  private apiUrl = 'http://localhost:3000/matches/results';

  constructor(private http: HttpClient) { }

  saveResult(result: any): Observable<any> {
    return this.http.post(this.apiUrl, result);
  }

  getResults(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

}
