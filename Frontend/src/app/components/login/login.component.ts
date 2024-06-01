import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

/*
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService) {}

  login(): void {
    this.authService.login(this.email, this.password)
      .subscribe(
        () => {

        },
        error => {
          this.error = error; 
        }
      );
  }
}
*/
/*

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
    loginForm = this.formBuilder.group({
    username: ['',Validators.required],
    password: ['',Validators.required],

  });

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) {}


  ngOnInit(): void {
  }
  


  get username(){
    return this.loginForm.controls.username;
  }

  get password(){
    return this.loginForm.controls.password;
  }


  login() {
    if (this.loginForm.valid) {   
      this.router.navigate(['/inicio']); 
    } else {
      this.loginForm.markAllAsTouched();
      alert('Error al ingresar los datos.');
    }
  }
  

}
*/




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
            // Redireccionar a la página de inicio después de iniciar sesión exitosamente
            this.router.navigate(['/inicio']);
          } else {
            // Mostrar un mensaje de error si el inicio de sesión falla
            alert('Usuario o contraseña incorrectos.');
          }
        },
        error => {
          // Mostrar un mensaje de error si hay un problema con la solicitud HTTP
          console.error('Error al iniciar sesión:', error);
          alert('Error al iniciar sesión. Por favor, inténtelo de nuevo más tarde.');
        }
      );
    } else {
      // Marcar todos los campos del formulario como "touched" si el formulario no es válido
      this.loginForm.markAllAsTouched();
      alert('Por favor, complete todos los campos.');
    }
  }


  
}
