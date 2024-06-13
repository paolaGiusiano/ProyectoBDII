import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, Validators, FormGroup, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  alumno: any;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const documento = this.authService.getDocumento();
    if (documento) {
      
      this.authService.getAlumno(documento).subscribe(
        (data: any) => {
          this.alumno = data;
        },
        (error: any) => {
          console.error('Error fetching alumno data', error);
        }
      );
    } else {
      console.error('Documento is null or undefined.');
    }
  }


  editProfile(): void {
    // agregar la lógica para editar el perfil
  }

}
