import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EstadisticasService } from '../../services/estadisticas.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent {
  estadisticas: any[] = [];
  carreras: any[] = [];
  filteredEstadisticas: any[] = [];

  constructor(private estadisticasService: EstadisticasService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadEstadisticas();
    this.loadCarreras();
  }

  loadEstadisticas() {
    this.estadisticasService.getEstadisticas().subscribe(
      data => {
        this.estadisticas = data;
        this.filteredEstadisticas = data;
      },
      error => {
        console.error('Error al cargar estadísticas', error);
      }
    );
  }

  loadCarreras() {
    this.authService.getCarreras().subscribe(
      data => {
        this.carreras = data;
      },
      error => {
        console.error('Error al cargar carreras', error);
      }
    );
  }

  filtrarPorCarrera(event: any) {
    const idCarrera = event.target.value;
    if (idCarrera === '0') {
      this.filteredEstadisticas = this.estadisticas;
    } else {
      this.filteredEstadisticas = this.estadisticas.filter(e => e.id_carrera == idCarrera);
    }
  }
  


}
