import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http'; 
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
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
import { VerPrediccionesComponent } from './components/ver-predicciones/ver-predicciones.component';
import { FixtureComponent } from './components/fixture/fixture.component';
import { CalendarioComponent } from './components/calendario/calendario.component';
import { IngresoResultadosComponent } from './components/ingreso-resultados/ingreso-resultados.component';
import { ResultadoService } from './services/resultado.service';
import { HacerPrediccionComponent } from './components/hacer-prediccion/hacer-prediccion.component';
import { VerResultadoComponent } from './components/ver-resultado/ver-resultado.component';
import { GruposComponent } from './components/grupos/grupos.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { PuntajesComponent } from './components/puntajes/puntajes.component';
import { PartidosService } from './services/partidos.services';
import { RankingComponent } from './components/ranking/ranking.component';
import { RegisterComponent } from './components/register/register.component';

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
    VerPrediccionesComponent,
    FixtureComponent,
    CalendarioComponent,
    IngresoResultadosComponent,
    HacerPrediccionComponent,
    VerResultadoComponent,
    GruposComponent,
    UserProfileComponent,
    PuntajesComponent,
    RankingComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule, 
    MatSnackBarModule,
    RouterModule,
    CommonModule,
    AppRoutingModule,
  ],
  providers: [AuthService, PrediccionesService, ResultadoService, PartidosService],
  bootstrap: [AppComponent]
})
export class AppModule { }
