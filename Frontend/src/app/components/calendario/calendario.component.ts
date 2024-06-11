import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent {
  partidos = [
    {
      grupo: "#01 - Grupo A",
      equipos: ["ARG", "CAN"],
      banderas: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_Argentina.svg/1200px-Flag_of_Argentina.svg.png",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/800px-Flag_of_Canada_%28Pantone%29.svg.png"
      ],
      fecha: "Jueves, 20/6",
      hora: "21:00",
      lugar: "Mercedes Benz Stadium - Atlanta, GA",
      imagenFondo: "https://media.11alive.com/assets/WXIA/images/d404f8e3-6861-411f-a81e-654ac5283e55/d404f8e3-6861-411f-a81e-654ac5283e55_1140x641.jpg"
    },
    {
      grupo: "#02 - Grupo A",
      equipos: ["Perú", "Chile"],
      banderas: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Flag_of_Peru_%281825%E2%80%931884%29.svg/270px-Flag_of_Peru_%281825%E2%80%931884%29.svg.png",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Flag_of_Chile.svg/2560px-Flag_of_Chile.svg.png"
      ],
      fecha: "Viernes, 21/6",
      hora: "21:00",
      lugar: "AT&T Stadium - Arlington, TX",
      imagenFondo: "https://about.att.com/ecms/dam/snr/2019/September2019/SocialShare/5G%20at%20AT&T%20Stadium%20Campaign%20PageLI_1200x627.jpg"
    },
    {
      grupo: "#03 - Grupo B",
      equipos: ["Ecuador", "Venezuela"],
      banderas: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-42EXK0m_qCklio4QdCNWYKLKkdKD9bIrnQ&s",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Venezuela.svg/2560px-Flag_of_Venezuela.svg.png"
      ],
      fecha: "Sábado, 22/6",
      hora: "19:00",
      lugar: "Levi’s Stadium, Santa Clara, California.",
      imagenFondo: "https://media.tycsports.com/files/2024/04/17/704922/levis-stadium_862x485_wmk.webp"
    },
    {
      grupo: "#04 - Grupo B",
      equipos: ["México", "Jamaica"],
      banderas: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF3iuqgxzWIuleew6xi59Y07PHKjm6gcy_sw&s",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Flag_of_Jamaica.svg/2560px-Flag_of_Jamaica.svg.png"
      ],
      fecha: "Sábado, 22/6",
      hora: "22:00",
      lugar: "NRG Stadium - Houston, TX",
      imagenFondo: "https://images.squarespace-cdn.com/content/v1/5d72a948ab019831fc775aa7/1568922542781-VSKEQ5DW9HT1RRS8NB1T/NRG+Stadium+at+Night.jpg"
    },

    {
      grupo: "#05 - Grupo C",
      equipos: ["EE.UU", "Bolivia"],
      banderas: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-5bZlXhgsqjGXfkE5uKIswtbRuKgOKLYjRw&s",
        "https://upload.wikimedia.org/wikipedia/commons/b/b3/Bandera_de_Bolivia_%28Estado%29.svg"
      ],
      fecha: "Domingo, 23/6",
      hora: "19:00",
      lugar: "AT&T Stadium - Arlington, TX",
      imagenFondo: "https://about.att.com/ecms/dam/snr/2019/September2019/SocialShare/5G%20at%20AT&T%20Stadium%20Campaign%20PageLI_1200x627.jpg"
    },

    {
      grupo: "#06 - Grupo C",
      equipos: ["Uruguay", "Panamá"],
      banderas: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_Uruguay.svg/1200px-Flag_of_Uruguay.svg.png",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Flag_of_Panama.svg/800px-Flag_of_Panama.svg.png"
      ],
      fecha: "Domingo, 23/6",
      hora: "22:00",
      lugar: "Hard Rock Stadium - Miami, FL",
      imagenFondo: "https://figueras.com/wp-content/uploads/2023/06/stadium_outside.jpg"
    },

    {
      grupo: "#07 - Grupo D",
      equipos: ["Colombia", "Paraguay"],
      banderas: [
        "https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Colombia.svg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Flag_of_Paraguay.svg/328px-Flag_of_Paraguay.svg.png"
      ],
      fecha: "Lunes, 24/6",
      hora: "19:00",
      lugar: "NRG Stadium - Houston, TX",
      imagenFondo: "https://images.squarespace-cdn.com/content/v1/5d72a948ab019831fc775aa7/1568922542781-VSKEQ5DW9HT1RRS8NB1T/NRG+Stadium+at+Night.jpg"
    },

    {
      grupo: "#08 - Grupo D",
      equipos: ["Brasil", "Costa Rica"],
      banderas: [
        "https://dbdzm869oupei.cloudfront.net/img/sticker/preview/4259.png",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Flag_of_Costa_Rica.svg/1200px-Flag_of_Costa_Rica.svg.png"
      ],
      fecha: "Lunes, 24/6",
      hora: "22:00",
      lugar: "SoFi Stadium, Inglewood, California.",
      imagenFondo: "https://upload.wikimedia.org/wikipedia/commons/b/b3/SoFi_Stadium_2023.jpg"
    },

    {
      grupo: "#09 - Grupo A",
      equipos: ["Perú", "Canadá"],
      banderas: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Flag_of_Peru_%281825%E2%80%931884%29.svg/270px-Flag_of_Peru_%281825%E2%80%931884%29.svg.png",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/800px-Flag_of_Canada_%28Pantone%29.svg.png"
      ],
      fecha: "Martes, 25/6",
      hora: "19:00",
      lugar: "Children's Mercy Park - Kansas City, KS",
      imagenFondo: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Children%27s_Mercy_Park_Aerial.jpg"
    },

    {
      grupo: "#10 - Grupo A",
      equipos: ["Chile", "Argentina"],
      banderas: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Flag_of_Peru_%281825%E2%80%931884%29.svg/270px-Flag_of_Peru_%281825%E2%80%931884%29.svg.png",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_Argentina.svg/1200px-Flag_of_Argentina.svg.png"
      ],
      fecha: "Martes, 25/6",
      hora: "22:00",
      lugar: "MetLife Stadium - East Rutherford, NJ",
      imagenFondo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTkkmP_jlIWNpujox7eHv9BK3speeHXhHxNw&s"
    },

    {
      grupo: "#11 - Grupo B",
      equipos: ["Ecuador", "Jamaica"],
      banderas: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-42EXK0m_qCklio4QdCNWYKLKkdKD9bIrnQ&s",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Flag_of_Jamaica.svg/2560px-Flag_of_Jamaica.svg.png"
      ],
      fecha: "Miércoles, 26/6",
      hora: "19:00",
      lugar: "Allegiant Stadium - Las Vegas, NV",
      imagenFondo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkD8KtdgV9Ld6jYqmnrzArDBgr_I5aCz94duOGZ2FMjMfDaeeF-35mwvtSBGqmL-qsj_0&usqp=CAU"
    },

    {
      grupo: "#12 - Grupo B",
      equipos: ["Venezuela", "México"],
      banderas: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Venezuela.svg/2560px-Flag_of_Venezuela.svg.png",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF3iuqgxzWIuleew6xi59Y07PHKjm6gcy_sw&s"
      ],
      fecha: "Miércoles, 26/6",
      hora: "22:00",
      lugar: "SoFi Stadium - Inglewood, CA",
      imagenFondo: "https://upload.wikimedia.org/wikipedia/commons/b/b3/SoFi_Stadium_2023.jpg"
    },

    {
      grupo: "#13 - Grupo C",
      equipos: ["Panamá", "EE.UU"],
      banderas: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Flag_of_Panama.svg/800px-Flag_of_Panama.svg.png",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-5bZlXhgsqjGXfkE5uKIswtbRuKgOKLYjRw&s"
      ],
      fecha: "Jueves, 27/6",
      hora: "19:00",
      lugar: "Mercedes Benz Stadium - Atlanta, GA",
      imagenFondo: "https://media.11alive.com/assets/WXIA/images/d404f8e3-6861-411f-a81e-654ac5283e55/d404f8e3-6861-411f-a81e-654ac5283e55_1140x641.jpg"
    },

    {
      grupo: "#14 - Grupo C",
      equipos: ["Uruguay", "Bolivia"],
      banderas: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_Uruguay.svg/1200px-Flag_of_Uruguay.svg.png",
        "https://upload.wikimedia.org/wikipedia/commons/b/b3/Bandera_de_Bolivia_%28Estado%29.svg"
      ],
      fecha: "Jueves, 27/6",
      hora: "22:00",
      lugar: "MetLife Stadium - East Rutherford, NJ",
      imagenFondo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTkkmP_jlIWNpujox7eHv9BK3speeHXhHxNw&s"
    },

    {
      grupo: "#15 - Grupo D",
      equipos: ["Colombia", "Costa Rica"],
      banderas: [
        "https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Colombia.svg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Flag_of_Costa_Rica.svg/1200px-Flag_of_Costa_Rica.svg.png"
      ],
      fecha: "Viernes, 28/6",
      hora: "19:00",
      lugar: "State Farm Stadium - Glendale, AZ",
      imagenFondo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-ZZ5KoNT6EzbOTUe1o57nKH5EP2uUmNWL_BmzSVmnq0PXHRb6mpHukX0ih9URDc47aDg&usqp=CAU"
    },

    {
      grupo: "#16 - Grupo D",
      equipos: ["Paraguay", "Brasil"],
      banderas: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Flag_of_Paraguay.svg/328px-Flag_of_Paraguay.svg.png",
        "https://dbdzm869oupei.cloudfront.net/img/sticker/preview/4259.png"
      ],
      fecha: "Viernes, 28/6",
      hora: "22:00",
      lugar: "Allegiant Stadium - Las Vegas, NV",
      imagenFondo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkD8KtdgV9Ld6jYqmnrzArDBgr_I5aCz94duOGZ2FMjMfDaeeF-35mwvtSBGqmL-qsj_0&usqp=CAU"
    },

    {
      grupo: "#17 - Grupo A",
      equipos: ["Argentina", "Perú"],
      banderas: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_Argentina.svg/1200px-Flag_of_Argentina.svg.png",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Flag_of_Peru_%281825%E2%80%931884%29.svg/270px-Flag_of_Peru_%281825%E2%80%931884%29.svg.png"
      ],
      fecha: "Sábado, 29/6",
      hora: "21:00",
      lugar: "Hard Rock Stadium - Miami, FL",
      imagenFondo: "https://figueras.com/wp-content/uploads/2023/06/stadium_outside.jpg"
    },

    {
      grupo: "#18 - Grupo A",
      equipos: ["Canadá", "Chile"],
      banderas: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/800px-Flag_of_Canada_%28Pantone%29.svg.png",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Flag_of_Peru_%281825%E2%80%931884%29.svg/270px-Flag_of_Peru_%281825%E2%80%931884%29.svg.png"
      ],
      fecha: "Sábado, 29/6",
      hora: "21:00",
      lugar: "Inter&Co Stadium - Orlando, FL",
      imagenFondo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRw9tne4pcn6rfzANUeK7IgYGDuinaBQBLL-g&s"
    },

    {
      grupo: "#19 - Grupo B",
      equipos: ["México", "Ecuador"],
      banderas: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF3iuqgxzWIuleew6xi59Y07PHKjm6gcy_sw&s",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-42EXK0m_qCklio4QdCNWYKLKkdKD9bIrnQ&s"
      ],
      fecha: "Domingo, 30/6",
      hora: "21:00",
      lugar: "State Farm Stadium - Glendale, AZ",
      imagenFondo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-ZZ5KoNT6EzbOTUe1o57nKH5EP2uUmNWL_BmzSVmnq0PXHRb6mpHukX0ih9URDc47aDg&usqp=CAU"
    },

    {
    grupo: "#20 - Grupo B",
      equipos: ["Jamaica", "Venezuela"],
      banderas: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Flag_of_Jamaica.svg/2560px-Flag_of_Jamaica.svg.png",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Venezuela.svg/2560px-Flag_of_Venezuela.svg.png"
      ],
      fecha: "Domingo, 30/6",
      hora: "21:00",
      lugar: "Q2 Stadium - Austin, TX",
      imagenFondo: "https://images.mlssoccer.com/image/private/t_editorial_landscape_8_desktop_mobile/mls-atx-prd/qnhtcn50e3cswphl6ggu.jpg"
    },

    {
    grupo: "#21 - Grupo C",
      equipos: ["Bolivia", "Panamá"],
      banderas: [
        "https://upload.wikimedia.org/wikipedia/commons/b/b3/Bandera_de_Bolivia_%28Estado%29.svg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Flag_of_Panama.svg/800px-Flag_of_Panama.svg.png"
      ],
      fecha: "Lunes, 1/7",
      hora: "22:00",
      lugar: "Inter&Co Stadium - Orlando, FL",
      imagenFondo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRw9tne4pcn6rfzANUeK7IgYGDuinaBQBLL-g&s"
    },

    {
      grupo: "#22 - Grupo C",
        equipos: ["EE.UU", "Uruguay"],
        banderas: [
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-5bZlXhgsqjGXfkE5uKIswtbRuKgOKLYjRw&s",
          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_Uruguay.svg/1200px-Flag_of_Uruguay.svg.png"
        ],
        fecha: "Lunes, 1/7",
        hora: "22:00",
        lugar: "GEHA Field at Arrowhead - Kansas City, MO",
        imagenFondo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQza44hFKWFFmAcXv-lvU0BQqtj-c6g3t26-w&s"
      },

      {
        grupo: "#23 - Grupo D",
          equipos: ["Brasil", "Colombia"],
          banderas: [
            "https://dbdzm869oupei.cloudfront.net/img/sticker/preview/4259.png",
            "https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Colombia.svg"
          ],
          fecha: "Martes, 2/7",
          hora: "22:00",
          lugar: "Levi's® Stadium - Santa Clara, CA",
          imagenFondo: "https://media.tycsports.com/files/2024/04/17/704922/levis-stadium_862x485_wmk.webp"
      },

      {
        grupo: "#24 - Grupo D",
          equipos: ["Costa Rica", "Paraguay"],
          banderas: [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Flag_of_Costa_Rica.svg/1200px-Flag_of_Costa_Rica.svg.png",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Flag_of_Paraguay.svg/328px-Flag_of_Paraguay.svg.png"
          ],
          fecha: "Martes, 2/7",
          hora: "22:00",
          lugar: "Q2 Stadium - Austin, TX",
          imagenFondo: "https://images.mlssoccer.com/image/private/t_editorial_landscape_8_desktop_mobile/mls-atx-prd/qnhtcn50e3cswphl6ggu.jpg"
      },

      {
        grupo: "Cuartos de final",
          equipos: ["", ""],
          banderas: [
            "",
            ""
          ],
          fecha: "Jueves, 4/7",
          hora: "22:00",
          lugar: "NRG Stadium - Houston, TX",
          imagenFondo: "https://images.squarespace-cdn.com/content/v1/5d72a948ab019831fc775aa7/1568922542781-VSKEQ5DW9HT1RRS8NB1T/NRG+Stadium+at+Night.jpg"
      },

      {
        grupo: "Cuartos de final",
          equipos: ["", ""],
          banderas: [
            "",
            ""
          ],
          fecha: "Viernes, 5/7",
          hora: "22:00",
          lugar: "AT&T Stadium - Arlington, TX",
          imagenFondo: "https://about.att.com/ecms/dam/snr/2019/September2019/SocialShare/5G%20at%20AT&T%20Stadium%20Campaign%20PageLI_1200x627.jpg"
      },

      {
        grupo: "Cuartos de final",
          equipos: ["", ""],
          banderas: [
            "",
            ""
          ],
          fecha: "Sábado, 6/7",
          hora: "19:00",
          lugar: "State Farm Stadium - Glendale, AZ",
          imagenFondo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-ZZ5KoNT6EzbOTUe1o57nKH5EP2uUmNWL_BmzSVmnq0PXHRb6mpHukX0ih9URDc47aDg&usqp=CAU"
      },

      {
        grupo: "Cuartos de final",
          equipos: ["", ""],
          banderas: [
            "",
            ""
          ],
          fecha: "Sábado, 6/7",
          hora: "22:00",
          lugar: "Allegiant Stadium - Las Vegas, NV",
          imagenFondo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkD8KtdgV9Ld6jYqmnrzArDBgr_I5aCz94duOGZ2FMjMfDaeeF-35mwvtSBGqmL-qsj_0&usqp=CAU"
      },

      {
        grupo: "Semifinal",
          equipos: ["", ""],
          banderas: [
            "",
            ""
          ],
          fecha: "Martes, 9/7",
          hora: "21:00",
          lugar: "MetLife Stadium - East Rutherford, NJ",
          imagenFondo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTkkmP_jlIWNpujox7eHv9BK3speeHXhHxNw&s"
      },

      {
        grupo: "Semifinal",
          equipos: ["", ""],
          banderas: [
            "",
            ""
          ],
          fecha: "Miércoles, 10/7",
          hora: "21:00",
          lugar: "Bank of America Stadium - Charlotte, NC",
          imagenFondo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzHJWpPBhq6BoUYpdU-_B8hkFBIhWvyb98TA&s"
      },

      {
        grupo: "3° Puesto",
          equipos: ["", ""],
          banderas: [
            "",
            ""
          ],
          fecha: "Sábado, 13/7",
          hora: "21:00",
          lugar: "Bank of America Stadium - Charlotte, NC",
          imagenFondo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzHJWpPBhq6BoUYpdU-_B8hkFBIhWvyb98TA&s"
      },

      {
        grupo: "Final",
          equipos: ["", ""],
          banderas: [
            "",
            ""
          ],
          fecha: "Domingo, 14/7",
          hora: "21:00",
          lugar: "Hard Rock Stadium - Miami, FL",
          imagenFondo: "https://figueras.com/wp-content/uploads/2023/06/stadium_outside.jpg"
      },

  ];
  


  partidosPorFecha: { [key: string]: any[] } = {};
  fechas: string[] = [];

  ngOnInit() {
    this.groupPartidosByFecha();
    this.insertarEstilosDinamicos();
  }

  groupPartidosByFecha() {
    this.partidos.forEach(partido => {
      if (!this.partidosPorFecha[partido.fecha]) {
        this.partidosPorFecha[partido.fecha] = [];
      }
      this.partidosPorFecha[partido.fecha].push(partido);
    });
    this.fechas = Object.keys(this.partidosPorFecha);
  }

  insertarEstilosDinamicos() {
    const style = document.createElement('style');
    style.innerHTML = `
      :root {
        ${this.partidos.map((partido, index) => `--imagen-fondo-partido-${index + 1}: url('${partido.imagenFondo}');`).join('\n')}
      }
    `;
    document.head.appendChild(style);
  }
  
}
