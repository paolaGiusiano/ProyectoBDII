
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PrediccionesService } from '../../services/predicciones.service';
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
    matchId: null
  };

  constructor(private predictionService: PrediccionesService) { }

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


  transformMatchTime(): void {
    this.upcomingMatches.forEach(match => {
      match.hora = new Date('1970-01-01T' + match.hora); // Concatenamos la fecha con la hora
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
