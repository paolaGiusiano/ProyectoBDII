/*import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { PrediccionesService } from '../../services/predicciones.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';  // <-- Import FormsModule

@Component({
  selector: 'app-predicciones',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './predicciones.component.html',
  styleUrls: ['./predicciones.component.css']
})
export class PrediccionesComponent implements OnInit {
  upcomingMatches: any[] = [];
  selectedMatch: any;
  prediction: any = {
    local: 0,
    visitante: 0,
    matchId: null,
    champion: '',
    runnerUp: ''
  };

  constructor(private formBuilder: FormBuilder, private router: Router, private predictionService: PrediccionesService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadUpcomingMatches();
  }

  loadUpcomingMatches(): void {
    this.predictionService.getUpcomingMatches().subscribe(matches => {
      this.upcomingMatches = matches;
      if (this.upcomingMatches.length > 0) {
        this.selectedMatch = this.upcomingMatches[0];
        this.prediction.matchId = this.selectedMatch.id;
      }
    });
  }

  
  

  onMatchChange(event: any): void {
    this.prediction.matchId = this.selectedMatch.id;
  }

  
  
  submitPrediction(): void {
    this.predictionService.submitPrediction(this.prediction).subscribe(response => {
      console.log('Predicción enviada con éxito', response);
    }, error => {
      console.error('Error al enviar la predicción', error);
    });
  }

}
*/


import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PrediccionesService } from '../../services/predicciones.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-predicciones',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './predicciones.component.html',
  styleUrls: ['./predicciones.component.css']
})
export class PrediccionesComponent implements OnInit {
  upcomingMatches: any[] = [];
  selectedMatch: any;
  prediction: any = {
    local: 0,
    visitante: 0,
    matchId: null,
    champion: '',
    runnerUp: ''
  };

  constructor(private formBuilder: FormBuilder, private router: Router, private predictionService: PrediccionesService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadUpcomingMatches();
  }

  loadUpcomingMatches(): void {
    this.predictionService.getUpcomingMatches().subscribe(matches => {
      this.upcomingMatches = matches;
      if (this.upcomingMatches.length > 0) {
        this.selectedMatch = this.upcomingMatches[0];
        this.prediction.matchId = this.selectedMatch.id;
      }
    });
  }

  onMatchChange(event: any): void {
    this.prediction.matchId = this.selectedMatch.id;
  }

  submitPrediction(): void {
    const documento_alumno = this.authService.getDocumento();
    if (documento_alumno) {
      console.log('Documento del usuario:', documento_alumno);
  
      // Datos para la tabla 'prediccion'
      const predictionData = {
        documento_alumno: documento_alumno,
        id_partido: this.prediction.matchId,
        prediccion_local: this.prediction.local,
        prediccion_visitante: this.prediction.visitante,
        campeon: this.prediction.champion,
        subcampeon: this.prediction.runnerUp
      };
  
      console.log('Enviando datos de predicción:', predictionData);
  
      // Envío de datos para la tabla 'prediccion'
      this.predictionService.submitPrediction(predictionData).subscribe(response => {
        console.log('Predicción enviada con éxito', response);
      }, error => {
        console.error('Error al enviar la predicción', error);
      });
    } else {
      console.error('Documento del usuario no encontrado');
    }
  }
  
  
  
  
}
