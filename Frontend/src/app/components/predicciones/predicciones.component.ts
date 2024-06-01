import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-predicciones',
  templateUrl: './predicciones.component.html',
  styleUrls: ['./predicciones.component.css']
})
export class PrediccionesComponent implements OnInit {
  predictionForm!: FormGroup; // Asegura que se inicializará en ngOnInit o en el constructor
  matches: { id: number, name: string }[] = []; // Array de partidos disponibles

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.predictionForm = this.formBuilder.group({
      selectedMatch: ['', Validators.required],
      prediction: ['', Validators.required]
    });

    // Aquí deberías cargar los partidos disponibles desde el servicio
    this.matches = [
      { id: 1, name: 'Partido 1' },
      { id: 2, name: 'Partido 2' },
      // Agrega más partidos según sea necesario
    ];
  }

  submitPredictions(): void {
    // Aquí deberías enviar la predicción al servicio para ser almacenada en la base de datos
    console.log('Predicción enviada:', this.predictionForm.value);
    // Limpia los campos después de enviar la predicción
    this.predictionForm.reset();
  }
}
