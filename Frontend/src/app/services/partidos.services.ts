import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartidosService {
  private apiUrl = 'http://localhost:3000/match/partidos'; 
                   

  constructor(private http: HttpClient) { }

  getPartidos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
