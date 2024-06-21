import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent {
  estadisticas: any[] = [];
  carreras: any[] = []; 

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadEstadisticas();
    this.loadCarreras();
  }

  loadEstadisticas() {
    // Ejemplo de solicitud ficticia (ajusta según tu backend)
    this.http.get<any[]>('URL_DEL_BACKEND/api/estadisticas')
      .subscribe(data => {
        this.estadisticas = data;
      }, error => {
        console.error('Error al cargar estadísticas', error);
      });
  }

  loadCarreras() {

    this.http.get<any[]>('URL_DEL_BACKEND/api/carreras')
      .subscribe(data => {
        this.carreras = data;
      }, error => {
        console.error('Error al cargar carreras', error);
      });
  }


  filtrarPorCarrera(idCarrera: number) {

  }
}
