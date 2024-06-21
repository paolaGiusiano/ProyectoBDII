import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormBuilder, FormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';


function documentoValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const value = control.value;
  const documentoRegex = /^\d{8}$/; 
  if (value && !documentoRegex.test(value)) {
      return { 'documentoInvalido': true };
  }
  return null;
}


function emailValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const value = control.value;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@correo.ucu.edu.uy$/;
  if (value && !emailRegex.test(value)) {
    return { 'emailInvalido': true };
  }
  return null;
}


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  carreras: any[] = [];
  equipos: any[] = [];

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

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {
    this.registerForm = this.fb.group({
      nombreApellido: ['', Validators.required],
      documento: ['', [Validators.required, documentoValidator]],
      email: ['', [Validators.required, Validators.email, emailValidator]],
      paisNacimiento: [''],
      carrera: ['', Validators.required],  
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      campeon: [''],
      subcampeon: ['']
    });
  }
  getFlagUrl(team: string): string {
    return `assets/${this.teamFlags[team] || 'default.png'}`;
  }
  

  ngOnInit() {
    this.authService.getCarreras().subscribe(data => {
      this.carreras = data;
    });

    this.authService.getEquipos().subscribe(data => {
      this.equipos = data;
    });
  }

  onSubmit() {
    console.log('Formulario enviado', this.registerForm.value);
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      const [nombre, apellido] = formValue.nombreApellido.split(' ');
  
      const formData = {
        ...formValue,
        nombre,
        apellido,
      };
  
      this.authService.register(formData).subscribe(
        response => {
          this.snackBar.open('Registro exitoso', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/login']);
        },
        error => {console.log("TS ", error.status, error.error.message);
          if (error.status === 400 && error.error.message === 'Solo se pueden registrar alumnos.') {
            this.snackBar.open('Solo se puede registrar alumnos', 'Cerrar', { duration: 3000 });
          } else {
            this.snackBar.open('Error en el registro', 'Cerrar', { duration: 3000 });
          }
        }
      );
    } else {
      this.registerForm.markAllAsTouched();
      alert('Por favor, complete todos los campos.');
    }
  }
  

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }


    



}
