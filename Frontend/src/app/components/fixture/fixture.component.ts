import { Component } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PrediccionesService } from '../../services/predicciones.service';
import { AuthService } from '../../services/auth.service';
import { ResultadoService } from '../../services/resultado.service';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

interface Match {
  id: number;
  fecha: string;
  hora: string;
  equipo_local: string;
  equipo_visitante: string;

}

interface Team {
  nombre: string;
  puntos: number;
  golesFavor: number;
  golesContra: number;
}

@Component({
  selector: 'app-fixture',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './fixture.component.html',
  styleUrl: './fixture.component.css'
})
export class FixtureComponent {
  matches: Match[] = [];
  predictions: { [key: number]: any } = {};
  tournamentPrediction: any = {
    campeon: '',
    subcampeon: ''
  };

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

  cuartosFinales: Match[] = [
    { id: 31, fecha: "Jueves, 4/7", hora: "22:00", equipo_local: "Por definirse", equipo_visitante: "Por definirse" },
    { id: 32, fecha: "Viernes, 5/7", hora: "22:00", equipo_local: "Por definirse", equipo_visitante: "Por definirse" },
    { id: 33, fecha: "Sábado, 6/7", hora: "19:00", equipo_local: "Por definirse", equipo_visitante: "Por definirse" },
    { id: 34, fecha: "Sábado, 6/7", hora: "22:00", equipo_local: "Por definirse", equipo_visitante: "Por definirse" }
  ];

  semifinales: Match[] = [
    { id: 29, fecha: "Martes, 9/7", hora: "21:00", equipo_local: "Por definirse", equipo_visitante: "Por definirse" },
    { id: 30, fecha: "Miércoles, 10/7", hora: "21:00", equipo_local: "Por definirse", equipo_visitante: "Por definirse" }
  ];

  constructor(private predictionService: PrediccionesService, private authService: AuthService, private resultadoService: ResultadoService , private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadUpcomingMatches();
    this.loadSavedPredictions();
    this.actualizarCuartos();
    this.actualizarSemifinal();
  }

  loadSavedPredictions(): void {
    const documento = this.authService.getDocumento();
    if (documento) {
      this.predictionService.getPredictions(documento).subscribe(predictions => {
        predictions.forEach((prediction: any) => {
          this.predictions[prediction.id_partido] = {
            prediccion_local: prediction.prediccion_local,
            prediccion_visitante: prediction.prediccion_visitante
          };
        });
      }, error => {
        console.error('Error al cargar las predicciones guardadas', error);
      });

      this.predictionService.getTorneoPrediction(documento).subscribe(prediction => {
        this.tournamentPrediction = prediction || { campeon: '', subcampeon: '' };
      }, error => {
        console.error('Error al cargar la predicción del torneo', error);
      });
    } else {
      console.error('Documento del usuario no encontrado');
    }
  }

  loadUpcomingMatches(): void {
    // Simular la carga de partidos futuros, idealmente desde un servicio
    this.matches = [...this.cuartosFinales, ...this.semifinales];

    this.matches.forEach(match => {
      this.predictions[match.id] = {
        prediccion_local: 0,
        prediccion_visitante: 0
      };
    });
  }

  saveMatchPrediction(matchId: number): void {
    const documento_alumno = this.authService.getDocumento();
    if (documento_alumno) {
      const predictionData = {
        documento_alumno: documento_alumno,
        id_partido: matchId,
        prediccion_local: this.predictions[matchId].prediccion_local,
        prediccion_visitante: this.predictions[matchId].prediccion_visitante,
      };
  
      this.predictionService.submitMatchPrediction(predictionData).subscribe(response => {
        this.snackBar.open('Predicción guardada!', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      }, error => {
        if (error.status === 400 && error.error) {
          if (error.error.error === 'No se puede modificar la predicción') {
            this.snackBar.open('No se puede modificar la predicción', 'Cerrar', {
              duration: 5000,
              panelClass: ['snackbar-error']
            });
          } else if (error.error.error === 'No se puede realizar la predicción') {
            this.snackBar.open('No se puede realizar la predicción', 'Cerrar', {
              duration: 5000,
              panelClass: ['snackbar-error']
            });
          } else {
            // Asumimos que el error 400 significa que la predicción ya existe y debe ser actualizada
            this.predictionService.updatePrediction(predictionData).subscribe(updateResponse => {
              this.snackBar.open('Predicción actualizada!', 'Cerrar', {
                duration: 3000,
                panelClass: ['snackbar-success']
              });
            }, updateError => {
              this.snackBar.open('Ocurrió un error al actualizar la predicción.', 'Cerrar', {
                duration: 5000,
                panelClass: ['snackbar-error']
              });
            });
          }
        } else {
          this.snackBar.open('Ocurrió un error al enviar la predicción.', 'Cerrar', {
            duration: 5000,
            panelClass: ['snackbar-error']
          });
        }
      });
    } else {
      console.error('Documento del usuario no encontrado');
    }
  }
/*
  saveTournamentPrediction(): void {
    const documento_alumno = this.authService.getDocumento();
    if (documento_alumno) {
      const predictionData = {
        documento_alumno: documento_alumno,
        campeon: this.tournamentPrediction.campeon,
        subcampeon: this.tournamentPrediction.subcampeon
      };
      this.predictionService.submitTournamentPrediction(predictionData).subscribe(response => {
        this.snackBar.open('Predicción del torneo guardada!', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      }, error => {
        if (error.status === 400) {
          this.snackBar.open('Ya has hecho una predicción para este torneo.', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        } else {
          this.snackBar.open('Ocurrió un error al enviar la predicción.', 'Cerrar', {
            duration: 5000,
            panelClass: ['snackbar-error']
          });
        }
      });
    } else {
      console.error('Documento del usuario no encontrado');
    }
  }
*/
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    return `${month}/${day}`;
  }


  formatTime(time: string): string {
    return time.substring(0, 5);
  }

  
  getFlagUrl(team: string): string {
    return `assets/${this.teamFlags[team] || 'default.png'}`;
  }


  actualizarCuartos(): void {
    this.resultadoService.getResults().subscribe(results => {
      const groups: { [key: string]: string[] } = {
        'A': ['Argentina', 'Perú', 'Chile', 'Canadá'],
        'B': ['México', 'Ecuador', 'Venezuela', 'Jamaica'],
        'C': ['Estados Unidos', 'Uruguay', 'Panamá', 'Bolivia'],
        'D': ['Brasil', 'Colombia', 'Paraguay', 'Costa Rica']
      };
  
      const teams: { [key: string]: Team } = {};
      const matchesPlayed: { [key: string]: number } = {};
  
      results.forEach((result: any) => {
        if (!teams[result.equipo_local]) {
          teams[result.equipo_local] = { nombre: result.equipo_local, puntos: 0, golesFavor: 0, golesContra: 0 };
          matchesPlayed[result.equipo_local] = 0;
        }
        if (!teams[result.equipo_visitante]) {
          teams[result.equipo_visitante] = { nombre: result.equipo_visitante, puntos: 0, golesFavor: 0, golesContra: 0 };
          matchesPlayed[result.equipo_visitante] = 0;
        }
  
        teams[result.equipo_local].golesFavor += result.goles_local;
        teams[result.equipo_local].golesContra += result.goles_visitante;
        teams[result.equipo_visitante].golesFavor += result.goles_visitante;
        teams[result.equipo_visitante].golesContra += result.goles_local;
  
        matchesPlayed[result.equipo_local]++;
        matchesPlayed[result.equipo_visitante]++;
  
        if (result.goles_local > result.goles_visitante) {
          teams[result.equipo_local].puntos += 3;
        } else if (result.goles_local < result.goles_visitante) {
          teams[result.equipo_visitante].puntos += 3;
        } else {
          teams[result.equipo_local].puntos += 1;
          teams[result.equipo_visitante].puntos += 1;
        }
      });
  
      const groupWinners: { [key: string]: Team } = {};
      const groupRunnersUp: { [key: string]: Team } = {};

      Object.keys(groups).forEach(groupKey => {
        const groupTeams = groups[groupKey].map(teamName => teams[teamName]);
  
        const eligibleTeams = groupTeams.filter(team => matchesPlayed[team.nombre] === 3);
  
        const sortedTeams = eligibleTeams.sort((a, b) => {
          if (b.puntos === a.puntos) {
            return (b.golesFavor - b.golesContra) - (a.golesFavor - a.golesContra);
          }
          return b.puntos - a.puntos;
        });
  

        if (sortedTeams.length > 0) {
          groupWinners[groupKey] = sortedTeams[0];
        } else {
          console.error(`No hay suficientes equipos elegibles que hayan jugado 3 partidos en el grupo ${groupKey}.`);
        }
  
 
        if (sortedTeams.length > 1) {
          groupRunnersUp[groupKey] = sortedTeams[1];
        } else {
          console.error(`No hay suficientes equipos elegibles que hayan jugado 3 partidos en el grupo ${groupKey}.`);
        }
      });
  
      if (Object.keys(groupWinners).length === 4 && Object.keys(groupRunnersUp).length === 4) {
   
        this.cuartosFinales[0].equipo_local = groupWinners['A'].nombre;
        this.cuartosFinales[0].equipo_visitante = groupRunnersUp['B'].nombre;
        this.cuartosFinales[1].equipo_local = groupWinners['B'].nombre;
        this.cuartosFinales[1].equipo_visitante = groupRunnersUp['A'].nombre;
        this.cuartosFinales[2].equipo_local = groupWinners['C'].nombre;
        this.cuartosFinales[2].equipo_visitante = groupRunnersUp['D'].nombre;
        this.cuartosFinales[3].equipo_local = groupWinners['D'].nombre;
        this.cuartosFinales[3].equipo_visitante = groupRunnersUp['C'].nombre;
      } else {
        console.error('No se encontraron suficientes ganadores o segundos lugares para los cuartos de final.');
      }
    }, error => {
      console.error('Error al obtener los resultados de los partidos', error);
    });
  }

  actualizarSemifinal(): void {
    // Obtener los resultados de los cuartos de final
    this.resultadoService.getResults().subscribe(results => {
      const cuartosGanadores: { [key: number]: string } = {};
  
      // Asignar los equipos ganadores de cada partido de cuartos
      this.cuartosFinales.forEach(cuarto => {
        const result = results.find((r: { id_partido: number }) => r.id_partido === cuarto.id);
        if (result) {
          if (result.goles_local > result.goles_visitante) {
            cuartosGanadores[cuarto.id] = cuarto.equipo_local;
          } else {
            cuartosGanadores[cuarto.id] = cuarto.equipo_visitante;
          }
        } else {
          console.error(`No se encontró el resultado para el partido de cuartos con ID ${cuarto.id}`);
        }
      });
  
      // Asignar equipos y banderas a las semifinales
      this.semifinales.forEach(semifinal => {
        if (semifinal.id === 29) {
          semifinal.equipo_local = cuartosGanadores[31]; // Ganador partido 1 cuartos
          semifinal.equipo_visitante = cuartosGanadores[32]; // Ganador partido 2 cuartos
        } else if (semifinal.id === 30) {
          semifinal.equipo_local = cuartosGanadores[33]; // Ganador partido 3 cuartos
          semifinal.equipo_visitante = cuartosGanadores[34]; // Ganador partido 4 cuartos
        }
      });
  
    }, error => {
      console.error('Error al obtener los resultados de los cuartos de final', error);
    });
  }
  


}
