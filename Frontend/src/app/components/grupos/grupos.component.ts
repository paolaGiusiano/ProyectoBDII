import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grupos',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './grupos.component.html',
  styleUrl: './grupos.component.css'
})
export class GruposComponent {
  grupos = [
    {
      nombre: 'GRUPO A',
      equipos: [
        { nombre: 'Argentina', bandera: 'assets/arg.png' },
        { nombre: 'Perú', bandera: 'assets/peru.png' },
        { nombre: 'Chile', bandera: 'assets/chile.png' },
        { nombre: 'Canadá', bandera: 'assets/can.png' }
      ]
    },
    {
      nombre: 'GRUPO B',
      equipos: [
        { nombre: 'México', bandera: 'assets/mex.jpg' },
        { nombre: 'Ecuador', bandera: 'assets/ecu.jpg' },
        { nombre: 'Venezuela', bandera: 'assets/ven.jpg' },
        { nombre: 'Jamaica', bandera: 'assets/jam.png' }
      ]
    },
    {
      nombre: 'GRUPO C',
      equipos: [
        { nombre: 'Estados Unidos', bandera: 'assets/eeuu.jpg' },
        { nombre: 'Uruguay', bandera: 'assets/uy.jpg' },
        { nombre: 'Panamá', bandera: 'assets/pan.jpg' },
        { nombre: 'Bolivia', bandera: 'assets/boli.jpg' }
      ]
    },
    {
      nombre: 'GRUPO D',
      equipos: [
        { nombre: 'Brasil', bandera: 'assets/br.jpg' },
        { nombre: 'Colombia', bandera: 'assets/colom.jpg' },
        { nombre: 'Paraguay', bandera: 'assets/py.png' },
        { nombre: 'Costa Rica', bandera: 'assets/crica.jpg' }
      ]
    }
  ];
}
