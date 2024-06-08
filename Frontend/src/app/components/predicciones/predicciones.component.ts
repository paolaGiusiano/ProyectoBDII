import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PrediccionesService } from '../../services/predicciones.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-predicciones',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './predicciones.component.html',
  styleUrls: ['./predicciones.component.css'],
})
export class PrediccionesComponent implements OnInit {
  upcomingMatches: any[] = [];
  selectedMatch: any;
  matchPrediction: any = {
    local: 0,
    visitante: 0,
    matchId: null,
    champion: '',
    runnerUp: ''
  };
  torneoPrediction: any = {
    champion: '',
    runnerUp: ''
  };

  constructor(private formBuilder: FormBuilder, private router: Router, private predictionService: PrediccionesService, private authService: AuthService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadUpcomingMatches();
  }

  loadUpcomingMatches(): void {
    this.predictionService.getUpcomingMatches().subscribe(matches => {
      this.upcomingMatches = matches;
      if (this.upcomingMatches.length > 0) {
        this.selectedMatch = this.upcomingMatches[0];
        this.matchPrediction.matchId = this.selectedMatch.id;
      }
    });
  }

  onMatchChange(event: any): void {
    this.matchPrediction.matchId = this.selectedMatch.id;
    
  }

  submitMatchPrediction(): void {
    const documento_alumno = this.authService.getDocumento();
    if (documento_alumno) {

      const predictionData = {
        documento_alumno: documento_alumno,
        id_partido: this.matchPrediction.matchId,
        prediccion_local: this.matchPrediction.local,
        prediccion_visitante: this.matchPrediction.visitante,
        
      };

      console.log('Enviando datos de predicción:', predictionData);

      this.predictionService.submitMatchPrediction(predictionData).subscribe(response => {
        console.log('Predicción enviada con éxito', response);
        this.snackBar.open('Predicción guardada!', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      }, error => {
        if (error.status === 400) {
          this.snackBar.open('Ya has hecho una predicción para este partido.', 'Cerrar', {
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

  submitTournamentPrediction(): void {
    const documento_alumno = this.authService.getDocumento();
    if (documento_alumno) {
      const predictionData = {
        documento_alumno: documento_alumno,
        campeon: this.torneoPrediction.champion,
        subcampeon: this.torneoPrediction.runnerUp
      };
      this.predictionService.submitTournamentPrediction(predictionData).subscribe(response => {
        this.snackBar.open('Predicción del torneo guardada!', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      }, error => {
          if (error.status === 400) {
              this.snackBar.open('Ya has hecho una predicción para este partido.', 'Cerrar', {
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
  
  
}
