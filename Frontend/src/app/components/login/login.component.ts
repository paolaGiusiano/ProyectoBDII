import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });


  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {}

  

  get username() {
    return this.loginForm.get('username');
  }

  get password(){
    return this.loginForm.get('password');
  }


    login() {
      if (this.loginForm.valid) {
        const username = this.username?.value;
        const password = this.password?.value;
  
        this.authService.login(username, password).subscribe(
          (response: any) => {
            if (response && response.message === 'Login successful') {
              const documento = response.documento;
              this.authService.getAlumno(documento).subscribe(
                alumnoResponse => {
                  if (alumnoResponse) {
                    // Si es un alumno, redirigir a /inicio
                    this.router.navigate(['/inicio']);
                  } else {
                    // Verificar si es administrador
                    this.authService.getAdministrador(documento).subscribe(
                      adminResponse => {
                        if (adminResponse) {
                          // Si es administrador, redirigir a /ingreso-resultado
                          this.router.navigate(['/ingreso-resultado']);
                        } else {
                          alert('No se pudo determinar el rol del usuario.');
                        }
                      },
                      error => {
                        console.error('Error verificando administrador:', error);
                        alert('Error al verificar el rol del usuario.');
                      }
                    );
                  }
                },
                error => {
                  console.error('Error verificando alumno:', error);
                  alert('Error al verificar el rol del usuario.');
                }
              );
            } else {
              alert(response.message); // Mostrar el mensaje de error devuelto por el backend
            }
          },
          error => {
            console.error('LoginComponent: Error al iniciar sesión:', error);
            if (error.status === 401) {
              alert(error.error.message); // Mostrar mensaje personalizado en caso de error 401
            } else {
              alert('Error al iniciar sesión. Por favor, inténtelo de nuevo más tarde.');
            }
          }
        );
      } else {
        // Marcar todos los campos del formulario como "touched" si el formulario no es válido
        this.loginForm.markAllAsTouched();
        alert('Por favor, complete todos los campos.');
        
      }
    }
    

  Register() {
    this.router.navigate(['/register']);
  }
  
}