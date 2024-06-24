import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ResultadoService } from '../../services/resultado.service';
import { PartidosService } from '../../services/partidos.services';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Match {
  id: number;
  fecha: string;
  hora: string;
  equipo_local: string;
  equipo_visitante: string;
}

interface Team {
  nombre: string;
  puntos: number;
  golesFavor: number;
  golesContra: number;
}

@Component({
  selector: 'app-ingreso-resultados',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './ingreso-resultados.component.html',
  styleUrls: ['./ingreso-resultados.component.css']
})
export class IngresoResultadosComponent implements OnInit {
  matches: Match[] = [];
  cuartosFinales: Match[] = [];
  semifinales: Match[] = [];
  final: Match[] = [];
  result: { [key: number]: { goles_local: number, goles_visitante: number } } = {};

  // Mapa de equipos a nombres de archivos de banderas
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

  constructor(
    private http: HttpClient,
    private resultadoService: ResultadoService,
    private snackBar: MatSnackBar,
    private partidosService: PartidosService // Inyecta el servicio PartidosService
  ) { }

  ngOnInit(): void {
    this.partidosService.getPartidos()
      .subscribe(data => {
        // Fase de grupos 
        this.matches = data.filter(match => match.id <= 24);
  
        // Cuartos de final 
        this.cuartosFinales = data.filter(match => match.id >= 45 && match.id <= 48);
  
        // Semifinales 
        this.semifinales = data.filter(match => match.id === 49 || match.id === 50);
        
        this.final = data.filter(match => match.id === 51); 

        this.matches.concat(this.cuartosFinales, this.semifinales, this.final).forEach(match => {
          if (this.isLocalStorageAvailable()) {
            const savedResult = localStorage.getItem(`result_${match.id}`);
            if (savedResult) {
              this.result[match.id] = JSON.parse(savedResult);
            } else {
              this.result[match.id] = { goles_local: 0, goles_visitante: 0 };
            }
          } else {
            this.result[match.id] = { goles_local: 0, goles_visitante: 0 };
          }
        });
      });
      this.actualizarCuartos();
      this.actualizarSemifinal();
      this.actualizarFinal();

  }

  saveResult(match: Match): void {
    const result = this.result[match.id];
    this.resultadoService.saveResult2({
      id_partido: match.id,
      goles_local: result.goles_local,
      goles_visitante: result.goles_visitante,
      equipo_local: match.equipo_local,
      equipo_visitante: match.equipo_visitante
    }).subscribe(
      response => {
        console.log('Result saved', response);

        if (this.isLocalStorageAvailable()) {
          localStorage.setItem(`result_${match.id}`, JSON.stringify(result));
        }

        this.snackBar.open('Resultado guardado con éxito', 'Cerrar', {
          duration: 3000,
        });
      },
      error => {
        console.error('Error saving result:', error);

        this.snackBar.open('Error al guardar el resultado', 'Cerrar', {
          duration: 3000,
        });
      }
    );
  }


  actualizarCuartos(): void {
    this.resultadoService.getResults().subscribe(results => {
      const groups: { [key: string]: string[] } = {
        'A': ['Argentina', 'Perú', 'Chile', 'Canadá'],
        'B': ['México', 'Ecuador', 'Venezuela', 'Jamaica'],
        'C': ['Estados Unidos', 'Uruguay', 'Panamá', 'Bolivia'],
        'D': ['Brasil', 'Colombia', 'Paraguay', 'Costa Rica']
      };
      
      const teams: { [key: string]: Team } = {};
      const matchesPlayed: { [key: string]: number } = {};
  
      results.forEach((result: any) => {
        if (!teams[result.equipo_local]) {
          teams[result.equipo_local] = { nombre: result.equipo_local, puntos: 0, golesFavor: 0, golesContra: 0 };
          matchesPlayed[result.equipo_local] = 0;
        }
        if (!teams[result.equipo_visitante]) {
          teams[result.equipo_visitante] = { nombre: result.equipo_visitante, puntos: 0, golesFavor: 0, golesContra: 0 };
          matchesPlayed[result.equipo_visitante] = 0;
        }
  
        teams[result.equipo_local].golesFavor += result.goles_local;
        teams[result.equipo_local].golesContra += result.goles_visitante;
        teams[result.equipo_visitante].golesFavor += result.goles_visitante;
        teams[result.equipo_visitante].golesContra += result.goles_local;
  
        matchesPlayed[result.equipo_local]++;
        matchesPlayed[result.equipo_visitante]++;
  
        if (result.goles_local > result.goles_visitante) {
          teams[result.equipo_local].puntos += 3;
        } else if (result.goles_local < result.goles_visitante) {
          teams[result.equipo_visitante].puntos += 3;
        } else {
          teams[result.equipo_local].puntos += 1;
          teams[result.equipo_visitante].puntos += 1;
        }
      });
  
      const groupWinners: { [key: string]: Team } = {};
      const groupRunnersUp: { [key: string]: Team } = {};

      Object.keys(groups).forEach(groupKey => {
        const groupTeams = groups[groupKey].map(teamName => teams[teamName]);
  
        const eligibleTeams = groupTeams.filter(team => matchesPlayed[team.nombre] === 3);
  
        const sortedTeams = eligibleTeams.sort((a, b) => {
          if (b.puntos === a.puntos) {
            return (b.golesFavor - b.golesContra) - (a.golesFavor - a.golesContra);
          }
          return b.puntos - a.puntos;
        });
  

        if (sortedTeams.length > 0) {
          groupWinners[groupKey] = sortedTeams[0];
        } else {
          console.error(`No hay suficientes equipos elegibles que hayan jugado 3 partidos en el grupo ${groupKey}.`);
        }
  
 
        if (sortedTeams.length > 1) {
          groupRunnersUp[groupKey] = sortedTeams[1];
        } else {
          console.error(`No hay suficientes equipos elegibles que hayan jugado 3 partidos en el grupo ${groupKey}.`);
        }
      });
  
      if (Object.keys(groupWinners).length === 4 && Object.keys(groupRunnersUp).length === 4) {
   
        this.cuartosFinales[0].equipo_local = groupWinners['A'].nombre;
        this.cuartosFinales[0].equipo_visitante = groupRunnersUp['B'].nombre;
        this.cuartosFinales[1].equipo_local = groupWinners['B'].nombre;
        this.cuartosFinales[1].equipo_visitante = groupRunnersUp['A'].nombre;
        this.cuartosFinales[2].equipo_local = groupWinners['C'].nombre;
        this.cuartosFinales[2].equipo_visitante = groupRunnersUp['D'].nombre;
        this.cuartosFinales[3].equipo_local = groupWinners['D'].nombre;
        this.cuartosFinales[3].equipo_visitante = groupRunnersUp['C'].nombre;
      } else {
        console.error('No se encontraron suficientes ganadores o segundos lugares para los cuartos de final.');
      }
    }, error => {
      console.error('Error al obtener los resultados de los partidos', error);
    });
  }


  actualizarSemifinal(): void {
    // Obtener los resultados de los cuartos de final
    this.resultadoService.getResults().subscribe(results => {
      const cuartosGanadores: { [key: number]: string } = {};
  
      // Asignar los equipos ganadores de cada partido de cuartos
      this.cuartosFinales.forEach(cuarto => {
        const result = results.find((r: { id_partido: number }) => r.id_partido === cuarto.id);
        if (result) {
          if (result.goles_local > result.goles_visitante) {
            cuartosGanadores[cuarto.id] = cuarto.equipo_local;
          } else {
            cuartosGanadores[cuarto.id] = cuarto.equipo_visitante;
          }
        } else {
          console.error(`No se encontró el resultado para el partido de cuartos con ID ${cuarto.id}`);
        }
      });
  
      // Asignar equipos y banderas a las semifinales
      this.semifinales.forEach(semifinal => {
        if (semifinal.id === 49) {
          semifinal.equipo_local = cuartosGanadores[45]; // Ganador partido 1 cuartos
          semifinal.equipo_visitante = cuartosGanadores[46]; // Ganador partido 2 cuartos
        } else if (semifinal.id === 50) {
          semifinal.equipo_local = cuartosGanadores[47]; // Ganador partido 3 cuartos
          semifinal.equipo_visitante = cuartosGanadores[48]; // Ganador partido 4 cuartos
        }
      });
  
    }, error => {
      console.error('Error al obtener los resultados de los cuartos de final', error);
    });
  }
  
  
  actualizarFinal(): void {
    this.resultadoService.getResults().subscribe(results => {
      const semifinalistas: { [key: string]: string } = {};
  
      // Obtener los equipos ganadores de las semifinales
      this.semifinales.forEach(semifinal => {
        const result = results.find((r: { id_partido: number }) => r.id_partido === semifinal.id);
        if (result) {
          if (result.goles_local > result.goles_visitante) {
            semifinalistas[semifinal.id] = semifinal.equipo_local;
          } else {
            semifinalistas[semifinal.id] = semifinal.equipo_visitante;
          }
        } else {
          console.error(`No se encontró el resultado para el partido de semifinal con ID ${semifinal.id}`);
        }
      });
  
      // Asignar equipos a la final
      this.final.forEach(final => {
        if (final.id === 51) { // ID del partido de la final
          final.equipo_local = semifinalistas[49]; // Equipo ganador de la primera semifinal
          final.equipo_visitante = semifinalistas[50]; // Equipo ganador de la segunda semifinal
        }
      });
  
    }, error => {
      console.error('Error al obtener los resultados de las semifinales', error);
    });
  }
  


  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    return `${day}/${month}`;
  }

  formatTime(timeString: string): string {
    const [hours, minutes] = timeString.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  }

  getFlagUrl(team: string): string {
    return `assets/${this.teamFlags[team] || 'default.png'}`;
  }


  isLocalStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }
}