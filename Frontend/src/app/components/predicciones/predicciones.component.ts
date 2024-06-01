/*import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PrediccionesService } from '../../services/predicciones.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-predicciones',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './predicciones.component.html',
  styleUrls: ['./predicciones.component.css']
})
export class PrediccionesComponent implements OnInit {
  predictionForm: FormGroup = this.formBuilder.group({
    prediccionLocal: ['', Validators.required],
    prediccionVisitante: ['', Validators.required],
    selectedMatch: ['', Validators.required],
  });; 
  matches: { id: number, name: string }[] = []; 

  constructor(private formBuilder: FormBuilder, private router: Router, private prediccionService: PrediccionesService) {}

  ngOnInit(): void {

    // Aquí deberías cargar los partidos disponibles desde el servicio
    this.matches = [
      { id: 1, name: 'Partido 1' },
      { id: 2, name: 'Partido 2' },
      // Agrega más partidos según sea necesario
    ];
  }

  prediccion(): void {
    // Aquí deberías enviar la predicción al servicio para ser almacenada en la base de datos
    console.log('Predicción enviada:', this.predictionForm.value);
    // Limpia los campos después de enviar la predicción
    this.predictionForm.reset();
  }
}*/


import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup,  ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PrediccionesService } from '../../services/predicciones.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-predicciones',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './predicciones.component.html',
  styleUrls: ['./predicciones.component.css']
})
export class PrediccionesComponent implements OnInit {
  predictionForm!: FormGroup; // Añadir ! para indicar que será inicializado en ngOnInit
  matches: { id: number, name: string }[] = []; 

  constructor(private formBuilder: FormBuilder, private router: Router, private prediccionService: PrediccionesService) {}

  ngOnInit(): void {
    this.predictionForm = this.formBuilder.group({
      prediccionLocal: ['', Validators.required],
      prediccionVisitante: ['', Validators.required],
      selectedMatch: ['', Validators.required],
    });

    this.loadMatches();
  }

  loadMatches(): void {
    this.prediccionService.getMatches()
      .subscribe(
        (data: any) => {
          this.matches = data;
        },
        (error) => {
          console.error('Error loading matches:', error);
        }
      );
  }

  submitPrediction(): void {
    if (this.predictionForm.valid) {
      this.prediccionService.submitPrediction(this.predictionForm.value)
        .subscribe(
          (response) => {
            console.log('Prediction submitted successfully:', response);
            this.predictionForm.reset();
          },
          (error) => {
            console.error('Error submitting prediction:', error);
          }
        );
    } else {
      console.error('Form validation failed. Please fill all required fields.');
    }
  }
}
