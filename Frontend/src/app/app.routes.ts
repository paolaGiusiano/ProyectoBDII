import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { PrediccionesComponent } from './components/predicciones/predicciones.component';
import { PremiosComponent } from './components/premios/premios.component';
import { ReglasComponent } from './components/reglas/reglas.component';
import { ComoJugarComponent } from './components/como-jugar/como-jugar.component';
import { PaginaPrincipalComponent } from './components/pagina-principal/pagina-principal.component';
import { VerPrediccionesComponent } from './components/ver-predicciones/ver-predicciones.component';
import { FixtureComponent } from './components/fixture/fixture.component';
import { CalendarioComponent } from './components/calendario/calendario.component';
import { IngresoResultadosComponent } from './components/ingreso-resultados/ingreso-resultados.component';
import { HacerPrediccionComponent } from './components/hacer-prediccion/hacer-prediccion.component';
import { VerResultadoComponent } from './components/ver-resultado/ver-resultado.component';
import { GruposComponent } from './components/grupos/grupos.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { PuntajesComponent } from './components/puntajes/puntajes.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { RegisterComponent } from './components/register/register.component';


export const routes: Routes = [ 
    { path: '', redirectTo: 'register', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent},
    { path: 'inicio', component: InicioComponent },
    { path: 'predicciones', component: PrediccionesComponent},
    { path: 'ver-predicciones', component: VerPrediccionesComponent},
    { path: 'premios', component: PremiosComponent},
    { path: 'reglas', component: ReglasComponent},
    { path: 'como-jugar', component: ComoJugarComponent},
    { path: 'paginaPrincipal', component: PaginaPrincipalComponent},
    { path: 'fixture', component: FixtureComponent},
    { path: 'calendario', component:  CalendarioComponent},
    { path: 'ingreso-resultado', component:  IngresoResultadosComponent},
    { path: 'hacer-prediccion', component: HacerPrediccionComponent},
    { path: 'ver-resultados', component: VerResultadoComponent},
    { path: 'grupos', component: GruposComponent},
    { path: 'perfil', component: UserProfileComponent},
    { path: 'puntajes', component: PuntajesComponent},
    { path: 'ranking', component: RankingComponent},
    { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
