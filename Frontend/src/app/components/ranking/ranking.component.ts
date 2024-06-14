// ranking.component.ts
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PuntajeService } from '../../services/puntaje.service';


@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {
  puntajesTotales: any[] = [];

  constructor(private puntajeService: PuntajeService) {}

  ngOnInit(): void {
    this.getPuntajesTotales();
  }

  getPuntajesTotales(): void {
    this.puntajeService.getPuntajesTotales().subscribe(
      (data) => {
        this.puntajesTotales = data;
      },
      (error) => {
        console.error('Error fetching puntajes totales', error);
      }
    );
  }
}
