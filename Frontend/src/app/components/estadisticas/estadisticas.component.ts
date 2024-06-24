import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EstadisticasService } from '../../services/estadisticas.service';
import { AuthService } from '../../services/auth.service';
import { PrediccionesService } from '../../services/predicciones.service';
import { ResultadoService } from '../../services/resultado.service';


export interface Resultado {
  id_partido: number;
  goles_local: number;
  goles_visitante: number;
  fecha: string;
}


@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent {
  estadisticas: any[] = [];
  carreras: any[] = [];
  filteredEstadisticas: any[] = [];
 

  constructor(private estadisticasService: EstadisticasService, private authService: AuthService, private prediccionesService: PrediccionesService, private resultadoService: ResultadoService) { }

  ngOnInit(): void {
    this.loadEstadisticas();
    this.loadCarreras();;
    this.calcularAciertos();
  }

  loadEstadisticas() {
    this.estadisticasService.getEstadisticas().subscribe(
      data => {
        this.estadisticas = data;
        this.filteredEstadisticas = data;
      },
      error => {
        console.error('Error al cargar estadísticas', error);
      }
    );
  }

  loadCarreras() {
    this.authService.getCarreras().subscribe(
      data => {
        this.carreras = data;
      },
      error => {
        console.error('Error al cargar carreras', error);
      }
    );
  }

  filtrarPorCarrera(event: any) {
    const idCarrera = parseInt(event.target.value, 10);
    if (idCarrera === 0) {
      this.filteredEstadisticas = this.estadisticas;
    } else {
      this.filteredEstadisticas = this.estadisticas.filter(e => e.id_carrera === idCarrera);
    }
  }

  calcularAciertos() {
    this.resultadoService.getResults().subscribe(
      (resultados: Resultado[]) => {
        this.prediccionesService.getAllPredictions().subscribe(
          predicciones => {
            this.estadisticas.forEach(estadistica => {
              const prediccionesAlumno = predicciones.filter(p => p.documento_alumno === estadistica.documento);
              estadistica.aciertos_exactos = 0;
              estadistica.aciertos_correctos = 0;
              estadistica.fallos = 0;

              prediccionesAlumno.forEach(prediccion => {
                const resultado = resultados.find((r: Resultado) => r.id_partido === prediccion.id_partido);
                if (resultado) {
                  if (prediccion.prediccion_local === resultado.goles_local && prediccion.prediccion_visitante === resultado.goles_visitante) {
                    estadistica.aciertos_exactos++;
                  } else if ((prediccion.prediccion_local === resultado.goles_local && prediccion.prediccion_visitante !== resultado.goles_visitante) ||
                             (prediccion.prediccion_local !== resultado.goles_local && prediccion.prediccion_visitante === resultado.goles_visitante)) {
                    estadistica.aciertos_correctos++;
                  } else {
                    estadistica.fallos++;
                  }
                }
              });

              estadistica.aciertos_totales = estadistica.aciertos_exactos + estadistica.aciertos_correctos;
            });
          },
          error => {
            console.error('Error al obtener predicciones', error);
          }
        );
      },
      error => {
        console.error('Error al obtener resultados', error);
      }
    );
  }
  


}