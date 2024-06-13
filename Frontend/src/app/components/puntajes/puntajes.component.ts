import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PrediccionesService } from '../../services/predicciones.service';
import { AuthService } from '../../services/auth.service';
import { ResultadoService } from '../../services/resultado.service';
import { PartidosService } from '../../services/partidos.services'; // Importa tu servicio de partidos

@Component({
  selector: 'app-puntajes',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './puntajes.component.html',
  styleUrls: ['./puntajes.component.css']
})
export class PuntajesComponent implements OnInit {
  predicciones: any[] = [];
  resultados: any[] = [];
  partidos: any[] = []; // Variable para almacenar los partidos
  puntosTotales = 0;

  constructor(private resultadoService: ResultadoService,
              private prediccionesService: PrediccionesService,
              private authService: AuthService,
              private partidosService: PartidosService) { }

  ngOnInit(): void {
    const documento = this.authService.getDocumento();
    if (!documento) {
      console.error('Documento del usuario no encontrado');
      return;
    }
    console.log("TS ", documento);
    this.prediccionesService.getPredictions(documento).subscribe(
      (data) => {
        this.predicciones = data;
        this.calcularPuntajes(); 
      },
      (error) => {
        console.error('Error al obtener las predicciones:', error);
      }
    );

    this.resultadoService.getResults().subscribe(
      (data) => {
        this.resultados = data;
        this.calcularPuntajes(); 
      },
      (error) => {
        console.error('Error al obtener los resultados de los partidos:', error);
      }
    );
    
    // Obtener los partidos desde el servicio de partidos
    this.partidosService.getPartidos().subscribe(
      (data) => {
        this.partidos = data;
      },
      (error) => {
        console.error('Error al obtener los partidos:', error);
      }
    );
  }

 
  calcularPuntajes(): void {
    this.puntosTotales = 0;
    // Aquí se calcula el puntaje total
    this.predicciones.forEach(prediccion => {
      const resultadoPartido = this.resultados.find(resultado => resultado.id_partido === prediccion.id_partido);
      if (resultadoPartido) {
        if (prediccion.prediccion_local === resultadoPartido.goles_local && prediccion.prediccion_visitante === resultadoPartido.goles_visitante) {
          this.puntosTotales += 4;
        } else if ((prediccion.prediccion_local > prediccion.prediccion_visitante && resultadoPartido.goles_local > resultadoPartido.goles_visitante) ||
                   (prediccion.prediccion_local < prediccion.prediccion_visitante && resultadoPartido.goles_local < resultadoPartido.goles_visitante) ||
                   (prediccion.prediccion_local === prediccion.prediccion_visitante && resultadoPartido.goles_local === resultadoPartido.goles_visitante)) {
          this.puntosTotales += 2;
        }
      }
    });
  }


  obtenerPuntaje(prediccion: any): number {
    let puntaje = 0;
    const resultadoPartido = this.resultados.find(resultado => resultado.id_partido === prediccion.id_partido);
    if (resultadoPartido) {
      if (prediccion.prediccion_local === resultadoPartido.goles_local && prediccion.prediccion_visitante === resultadoPartido.goles_visitante) {
        puntaje += 4;
      } else if ((prediccion.prediccion_local > prediccion.prediccion_visitante && resultadoPartido.goles_local > resultadoPartido.goles_visitante) ||
                 (prediccion.prediccion_local < prediccion.prediccion_visitante && resultadoPartido.goles_local < resultadoPartido.goles_visitante) ||
                 (prediccion.prediccion_local === prediccion.prediccion_visitante && resultadoPartido.goles_local === resultadoPartido.goles_visitante)) {
        puntaje += 2;
      }
    }
    return puntaje;
  }

}
