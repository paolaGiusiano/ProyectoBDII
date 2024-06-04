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


export const routes: Routes = [ 
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'inicio', component: InicioComponent },
    { path: 'predicciones', component: PrediccionesComponent},
    { path: 'ver-predicciones', component: VerPrediccionesComponent},
    { path: 'premios', component: PremiosComponent},
    { path: 'reglas', component: ReglasComponent},
    { path: 'como-jugar', component: ComoJugarComponent},
    {path: 'paginaPrincipal', component: PaginaPrincipalComponent},
    { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
