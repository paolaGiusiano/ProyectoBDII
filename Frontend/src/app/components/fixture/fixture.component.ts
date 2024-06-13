import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fixture',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './fixture.component.html',
  styleUrls: ['./fixture.component.css']
})
export class FixtureComponent {
   // Datos de ejemplo para los equipos y sus enfrentamientos
   partidosCuartos = [
    { equipoLocal: 'Equipo A', equipoVisitante: 'Equipo B' },
    { equipoLocal: 'Equipo C', equipoVisitante: 'Equipo D' },
    { equipoLocal: 'Equipo E', equipoVisitante: 'Equipo F' },
    { equipoLocal: 'Equipo G', equipoVisitante: 'Equipo H' },
  ];

  // Datos de los partidos de semifinales
  partidosSemifinales = [
    { equipoLocal: 'Ganador 1', equipoVisitante: 'Ganador 2' },
    { equipoLocal: 'Ganador 3', equipoVisitante: 'Ganador 4' },
  ];

  // Datos del partido final
  partidoFinal = { equipoLocal: 'Ganador 1/2', equipoVisitante: 'Ganador 3/4' }

}