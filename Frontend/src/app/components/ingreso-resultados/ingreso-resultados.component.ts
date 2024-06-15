import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ResultadoService } from '../../services/resultado.service';
import { PartidosService } from '../../services/partidos.services';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Match {
  id: number;
  fecha: string;
  hora: string;
  equipo_local: string;
  equipo_visitante: string;
}

@Component({
  selector: 'app-ingreso-resultados',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './ingreso-resultados.component.html',
  styleUrls: ['./ingreso-resultados.component.css']
})
export class IngresoResultadosComponent implements OnInit {
  matches: Match[] = [];
  result: { [key: number]: { goles_local: number, goles_visitante: number } } = {};

  // Mapa de equipos a nombres de archivos de banderas
  teamFlags: { [key: string]: string } = {
    'Argentina': 'arg.png',
    'Canadá': 'can.png',
    'Chile': 'chile.png',
    'Perú': 'peru.png',
    'Ecuador': 'ecu.jpg',
    'Venezuela': 'ven.jpg',
    'México': 'mex.jpg',
    'Jamaica': 'jam.png',
    'Estados Unidos': 'eeuu.jpg',
    'Bolivia': 'boli.jpg',
    'Uruguay': 'uy.jpg',
    'Panamá': 'pan.jpg',
    'Colombia': 'colom.jpg',
    'Paraguay': 'py.png',
    'Costa Rica': 'crica.jpg',
    'Brasil': 'br.jpg',
  };

  constructor(
    private http: HttpClient,
    private resultadoService: ResultadoService,
    private snackBar: MatSnackBar,
    private partidosService: PartidosService // Inyecta el servicio PartidosService
  ) { }

  ngOnInit(): void {
    this.partidosService.getPartidos() // Usa el servicio PartidosService
      .subscribe(data => {
        this.matches = data;
        // Initialize result object for each match
        this.matches.forEach(match => {
          if (this.isLocalStorageAvailable()) {
            const savedResult = localStorage.getItem(`result_${match.id}`);
            if (savedResult) {
              this.result[match.id] = JSON.parse(savedResult);
            } else {
              this.result[match.id] = { goles_local: 0, goles_visitante: 0 };
            }
          } else {
            this.result[match.id] = { goles_local: 0, goles_visitante: 0 };
          }
        });
      });
  }

  saveResult(matchId: number): void {
    const result = this.result[matchId];
    this.resultadoService.saveResult({
      id_partido: matchId,
      goles_local: result.goles_local,
      goles_visitante: result.goles_visitante,
    }).subscribe(
      response => {
        console.log('Result saved', response);
        // Save result to localStorage
        if (this.isLocalStorageAvailable()) {
          localStorage.setItem(`result_${matchId}`, JSON.stringify(result));
        }
        // Show success snackBar
        this.snackBar.open('Resultado guardado con éxito', 'Cerrar', {
          duration: 3000,
        });
      },
      error => {
        console.error('Error saving result:', error);
        // Show error snackBar
        this.snackBar.open('Error al guardar el resultado', 'Cerrar', {
          duration: 3000,
        });
      }
    );
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    // Obteniendo día y mes en formato 'DD/MM'
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    return `${day}/${month}`;
  }

  formatTime(timeString: string): string {
    const [hours, minutes] = timeString.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  }

  getFlagUrl(team: string): string {
    return `assets/${this.teamFlags[team] || 'default.png'}`;
  }

  // Función para verificar si localStorage está disponible
  isLocalStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }
}
