import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ResultadoService } from '../../services/resultado.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Resultado {
  id_partido: number;
  goles_local: number;
  goles_visitante: number;
  fecha: string;
  equipo_local: string;
  equipo_visitante: string;
}


@Component({
  selector: 'app-ver-resultado',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './ver-resultado.component.html',
  styleUrl: './ver-resultado.component.css'
})
export class VerResultadoComponent {
  resultados: Resultado[] = [];

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

  constructor(private resultadoService: ResultadoService) { }

  ngOnInit(): void {
    this.resultadoService.getResults().subscribe(
      (data: Resultado[]) => {
        this.resultados = data;
      },
      (error) => {
        console.error('Error fetching results:', error);
      }
    );
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    return `${day}/${month}`;
  }

  getFlagUrl(team: string): string {
    return `assets/${this.teamFlags[team] || 'default.png'}`;
  }
  
}
