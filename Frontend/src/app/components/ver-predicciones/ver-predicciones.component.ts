import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PrediccionesService } from '../../services/predicciones.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-ver-predicciones',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './ver-predicciones.component.html',
  styleUrls: ['./ver-predicciones.component.css']
})
export class VerPrediccionesComponent implements OnInit {
  predictions: any[] = [];

  constructor(private formBuilder: FormBuilder, private router: Router, private predictionService: PrediccionesService, private authService: AuthService) {}
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
    console.log('Editar predicción:', prediction);
  }



}
