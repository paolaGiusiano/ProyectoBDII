/*import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/login';
  private documento: string | null = null;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { username, password });
  }


}*/


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  message: string;
  role: string;
  documento: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000';
  private documento: string | null = null;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, { username, password }).pipe(
      tap(response => {
        if (response && response.documento) {
          this.documento = response.documento;
          localStorage.setItem('documento', this.documento);  
        }
      })
    );
  }

  
  getDocumento(): string | null {
    const documento = this.documento || localStorage.getItem('documento');
    return documento;
  }



  logout(): void {
    this.documento = null;
    localStorage.removeItem('documento');
    console.log('Documento eliminado');
  }

  

}
