import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PrediccionesService } from '../../services/predicciones.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ver-predicciones',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './ver-predicciones.component.html',
  styleUrls: ['./ver-predicciones.component.css']
})
export class VerPrediccionesComponent implements OnInit {
  predictions: any[] = [];
  showEditForm: boolean = false;
  editingPrediction: any;
   editingPredictionId: number | null = null;
  editPredictionForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private predictionService: PrediccionesService,
    private authService: AuthService
  ) {
    this.editPredictionForm = this.formBuilder.group({
      id_partido: ['', Validators.required],
      prediccion_local: ['', Validators.required],
      prediccion_visitante: ['', Validators.required],
      campeon: ['', Validators.required],
      subcampeon: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadPredictions();
  }

  loadPredictions(): void {
    const documento = this.authService.getDocumento();
    if (documento) {
      this.predictionService.getPredictions(documento).subscribe(predictions => {
        this.predictions = predictions;
      }, error => {
        console.error('Error al cargar las predicciones', error);
      });
    } else {
      console.error('Documento del usuario no encontrado');
    }
  }

  deletePrediction(id_prediccion: number): void {
    const documento = this.authService.getDocumento();
    if (documento) {
      this.predictionService.deletePrediction(id_prediccion).subscribe(() => {
        this.loadPredictions();
      }, error => {
        console.error('Error al eliminar la predicción', error);
      });
    } else {
      console.error('Documento del usuario no encontrado');
    }
  }


  editPrediction(prediction: any): void {
    console.log('Editando predicción', prediction);
    this.showEditForm = true;
    this.editingPredictionId = prediction.id;
    const documento = this.authService.getDocumento();
    this.editPredictionForm.patchValue({
      documento_alumno: documento,
      id_partido: prediction.id_partido,
      prediccion_local: prediction.prediccion_local,
      prediccion_visitante: prediction.prediccion_visitante,
      campeon: prediction.campeon,
      subcampeon: prediction.subcampeon
    });

  }


  updatePrediction(): void {
    console.log('Form values:', this.editPredictionForm.value);
    console.log('Editing Prediction ID:', this.editingPredictionId);
    if (this.editingPredictionId !== null) {
      const predictionData = {
        id: this.editingPredictionId,
        documento_alumno: this.authService.getDocumento(),
        id_partido: this.editPredictionForm.value.id_partido,
        prediccion_local: this.editPredictionForm.value.prediccion_local,
        prediccion_visitante: this.editPredictionForm.value.prediccion_visitante,
        campeon: this.editPredictionForm.value.campeon || '',
        subcampeon: this.editPredictionForm.value.subcampeon || ''
      };
      console.log('Datos de la predicción:', predictionData);
      this.predictionService.updatePrediction(predictionData).subscribe({
        next: () => {
          this.loadPredictions();
          this.showEditForm = false;
          this.editingPredictionId = null;
        },
        error: (error) => {
          console.error('Error al actualizar la predicción', error);
          if (error.status === 200 && typeof error.error.text === 'string') {
            console.error('Parece que la respuesta no está en formato JSON:', error.error.text);
          }
        }
      });
    } else {
      console.error('No se ha seleccionado ninguna predicción para modificar');
    }
  }
  

  cancelEdit(): void {
    this.showEditForm = false;
    this.editingPrediction = null;
  }
}
