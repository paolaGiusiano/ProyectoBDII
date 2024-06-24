import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResultadoService {
  private apiUrl = 'http://localhost:3000/result/matches/results';
 

  constructor(private http: HttpClient) { }

  saveResult(result: any): Observable<any> {
    return this.http.post(this.apiUrl, result);
  }
  saveResult2(matchData: any): Observable<any> {console.log("SAVE ", matchData);
    return this.http.post(this.apiUrl, matchData);
  }

  getResults(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // obtener el resultado del último partido (la final)
  getFinalResult(): Observable<any> { 
    const finalResultUrl = `${this.apiUrl}/final`;
    return this.http.get(finalResultUrl);
  }

  updateMatchTeams(matchId: number, equipo_local: string, equipo_visitante: string): Observable<any> {
    const updateUrl = `${this.apiUrl}/updateTeams`;
    return this.http.put(updateUrl, { matchId, equipo_local, equipo_visitante });
  }
  

}
