import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap} from 'rxjs';


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
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, { username, password }).pipe(
      tap(response => { 
        if (response && response.documento) {
          this.documento = response.documento;
          localStorage.setItem('documento', this.documento);  
        }
      })
    );
  }
 
  /*
  getDocumento(): string | null {
    const documento = this.documento || localStorage.getItem('documento');
    return documento;
  }*/
  

  getDocumento() {
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem('documento');
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }
  
    
  getAlumno(documento: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user/alumnos/${documento}`);
  }

  getAdministrador(documento: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user/administrador/${documento}`);
  }


  logout(): void {
    this.documento = null;
    localStorage.removeItem('documento');
    console.log('Documento eliminado');
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, userData);
  }


  getCarreras(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/match/carreras`);
  }

  getEquipos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/match/equipos`);
  }



}
