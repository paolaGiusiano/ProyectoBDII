import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http'; 
import { AppRoutingModule } from './app.routes';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { PrediccionesComponent } from './components/predicciones/predicciones.component';
import { PremiosComponent } from './components/premios/premios.component';
import { ReglasComponent } from './components/reglas/reglas.component';
import { ComoJugarComponent } from './components/como-jugar/como-jugar.component';
import { PaginaPrincipalComponent } from './components/pagina-principal/pagina-principal.component';
import { AuthService } from './services/auth.service';
import { PrediccionesService } from './services/predicciones.service';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    InicioComponent,
    PrediccionesComponent,
    PremiosComponent,
    ReglasComponent,
    ComoJugarComponent,
    PaginaPrincipalComponent,

 
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule, 
    RouterModule,
    AppRoutingModule,
  ],
  providers: [AuthService, PrediccionesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
