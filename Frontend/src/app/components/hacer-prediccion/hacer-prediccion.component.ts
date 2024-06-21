import { Component } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PrediccionesService } from '../../services/predicciones.service';
import { AuthService } from '../../services/auth.service';
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

@Component({
  selector: 'app-hacer-prediccion',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './hacer-prediccion.component.html',
  styleUrl: './hacer-prediccion.component.css'
})
export class HacerPrediccionComponent {
  matches: Match[] = [];
  predictions: { [key: number]: any } = {};
  tournamentPrediction: any = {
    campeon: '',
    subcampeon: ''
  };
  upcomingMatches: Match[] = [];
  pastMatches: Match[] = [];
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

  constructor(private formBuilder: FormBuilder, private router: Router, private predictionService: PrediccionesService, private authService: AuthService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadUpcomingMatches();
    this.loadSavedPredictions();
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
    this.predictionService.getUpcomingMatches().subscribe((matches: Match[]) => {
      this.matches = matches.filter(match => match.id <= 24);
      matches.forEach(match => {
        this.predictions[match.id] = {
          prediccion_local: 0,
          prediccion_visitante: 0
        };
      });
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


  

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    return `${day}/${month}`;
  }

  formatTime(time: string): string {
    return time.substring(0, 5);
  }

  getFlagUrl(team: string): string {
    return `assets/${this.teamFlags[team] || 'default.png'}`;
  }
}
