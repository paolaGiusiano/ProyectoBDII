CREATE DATABASE IF NOT EXISTS `pencaucu`;

USE `pencaucu`;


CREATE TABLE IF NOT EXISTS `usuario` (
  `documento` varchar(8) NOT NULL,
  `nombre` varchar(40) NOT NULL,
  `apellido` varchar(40) NOT NULL,
  `pais_nacimiento` varchar(40) NOT NULL,
  `email` varchar(100) NOT NULL, 
   UNIQUE(`documento`),
  PRIMARY KEY (`documento`)
);


CREATE TABLE IF NOT EXISTS `login` (
  `username` varchar(100) NOT NULL PRIMARY KEY,
  `password` varchar(255) NOT NULL,
  `documento_usuario` varchar(8) NOT NULL,
  FOREIGN KEY (`documento_usuario`) REFERENCES `usuario`(`documento`)
);


CREATE TABLE IF NOT EXISTS `carrerra` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `departamento` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `administrador` (
  `documento` varchar(8) NOT NULL,
  PRIMARY KEY (`documento`),
  FOREIGN KEY (`documento`) REFERENCES `usuario`(`documento`)
);

CREATE TABLE IF NOT EXISTS `alumno` (
  `documento` varchar(8) NOT NULL,
  `anio_ingreso` year(4) NOT NULL,
  `id_carrera` int(11) NOT NULL,
  PRIMARY KEY (`documento`),
  FOREIGN KEY (`documento`) REFERENCES `usuario`(`documento`),
  FOREIGN KEY (`id_carrera`) REFERENCES `carrerra`(`id`)
);


CREATE TABLE IF NOT EXISTS `equipo` (
  `pais` VARCHAR(50) NOT NULL,
   PRIMARY KEY (`pais`)
);


CREATE TABLE IF NOT EXISTS `compite` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `fecha` DATE NOT NULL,
  `hora` TIME NOT NULL,
  `equipo_local` VARCHAR(50) NOT NULL,
  `equipo_visitante` VARCHAR(50) NOT NULL,
  FOREIGN KEY (`equipo_local`) REFERENCES `equipo` (`pais`),
  FOREIGN KEY (`equipo_visitante`) REFERENCES `equipo` (`pais`)
);


CREATE TABLE IF NOT EXISTS `prediccion` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `documento_alumno` VARCHAR(8) NOT NULL,
  `id_partido` INT NOT NULL,
  `prediccion_local` INT(11) NOT NULL,
  `prediccion_visitante` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`documento_alumno`) REFERENCES `alumno`(`documento`),
  FOREIGN KEY (`id_partido`) REFERENCES `compite`(`id`)
);

CREATE TABLE IF NOT EXISTS `prediccion_campeonato` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `documento_alumno` VARCHAR(8) NOT NULL,
  `campeon` VARCHAR(50) NOT NULL,
  `subcampeon` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`documento_alumno`) REFERENCES `alumno`(`documento`),
  FOREIGN KEY (`campeon`) REFERENCES `equipo`(`pais`),
  FOREIGN KEY (`subcampeon`) REFERENCES `equipo`(`pais`)
);


CREATE TABLE IF NOT EXISTS `plantel` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL,
  `posicion` VARCHAR(50) NOT NULL,
  `equipo_pais`  VARCHAR(50) NOT NULL,
  FOREIGN KEY (`equipo_pais`) REFERENCES `equipo`(`pais`)
);


CREATE TABLE IF NOT EXISTS `resultado` (
  `id_partido` int(25) NOT NULL,
  `goles_local` int(11) NOT NULL,
  `goles_visitante` int(11) NOT NULL,
  `fecha` DATE NOT NULL,
  PRIMARY KEY (`id_partido`),
  FOREIGN KEY (`id_partido`) REFERENCES `compite`(`id`)
);


CREATE TABLE IF NOT EXISTS `PuntajeTotal` (
    `id`  INT AUTO_INCREMENT PRIMARY KEY,
    `documento_alumno` varchar(8) NOT NULL,
    `puntaje_total`  INT,
    UNIQUE(`documento_alumno`),
    FOREIGN KEY (`documento_alumno` ) REFERENCES `alumno`(`documento` )
);


CREATE TABLE IF NOT EXISTS `premio` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);



INSERT INTO `usuario` (`documento`, `nombre`, `apellido`, `pais_nacimiento`, `rol`, `email`)
VALUES
('12345678', 'Paola', 'Giusiano', 'Uruguay', 'alumno', 'paolagiusianop@gmail.com'),
('87654321', 'Pepe', 'Gomez', 'Argentina', 'administrador', 'pepe.gomez@gmail.com'),
('11223344', 'Test', 'User', 'Uruguay', 'alumno', 'test.user@example.com');


INSERT INTO `login` (`username`, `password`, `documento_usuario`) 
VALUES ('paola.giusiano', '$2b$10$9QSGpaUKyZc6DjKRSUiJYuYGa8216jflsDf3GyomOHtw/e1BakcMu', '12345678');

INSERT INTO `login` (`username`, `password`, `documento_usuario`) 
VALUES ('pepe.gomez', '$2b$10$nVAgV5kECObED7VLQNSIc.3ifPg/2Mx/hjaoIyxLxbePPxG.rrIdS', '87654321');

INSERT INTO `login` (`username`, `password`, `documento_usuario`) 
VALUES ('test.user', '$2b$10$BUGEwwF5kXguL205h/1OxOOrQ3bnoIeTAJ/1Aaq7AJbef62Lh2erm', '11223344');


USE `pencaucu`;


INSERT INTO `carrerra` (`nombre`, `departamento`) VALUES
('Ingeniería en informática', 'Facultad de Ingeniería'),
('Medicina', 'Facultad de Ciencias de la Salud'),
('Derecho', 'Facultad de Derecho'),
('Economía', 'Facultad de Ciencias Económicas'),
('Arquitectura', 'Facultad de Arquitectura'),
('Psicología', 'Facultad de Humanidades'),
('Química', 'Facultad Química'),
('Filosofía', 'Facultad de Humanidades'),
('Matemáticas', 'Facultad de Ciencias');


INSERT INTO `equipo` (`pais`) VALUES
('Argentina'),
('Canadá'),
('Perú'),
('Chile'),
('Ecuador'),
('Venezuela'),
('México'),
('Jamaica'),
('Estados Unidos'),
('Bolivia'),
('Uruguay'),
('Panamá'),
('Colombia'),
('Paraguay'),
('Brasil'),
('Costa Rica');



--- INSERTAR PLANTEL

USE `pencaucu`;

INSERT INTO `plantel` (`nombre`, `posicion`, `numero_camiseta`, `equipo_pais`)
VALUES
-- Arqueros
('Franco Armani', 'Portero', (SELECT pais FROM equipo WHERE nombre = 'Argentina')),
('Gerónimo Rulli', 'Portero', (SELECT pais FROM equipo WHERE nombre = 'Argentina')),
('Emiliano Martínez', 'Portero', (SELECT pais FROM equipo WHERE nombre = 'Argentina')),
-- Defensas
('Gonzalo Montiel', 'Defensa', (SELECT pais FROM equipo WHERE nombre = 'Argentina')),
('Nahuel Molina', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Argentina')),
('Leonardo Balerdi', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Argentina')),
('Cristian Romero', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Argentina')),
('Germán Pezzella', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Argentina')),
('Lucas Martínez Quarta', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Argentina')),
('Nicolás Otamendi', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Argentina')),
('Lisandro Martínez', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Argentina')),
('Marcos Acuña', 'Defensa',  (SELECT id FROM equipo WHERE nombre = 'Argentina')),
('Nicolás Tagliafico', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Argentina')),
('Valentín Barco', 'Defensa',  (SELECT id FROM equipo WHERE nombre = 'Argentina')),
-- Centrocampistas
('Guido Rodríguez', 'Centrocampista',  (SELECT id FROM equipo WHERE nombre = 'Argentina')),
('Leandro Paredes', 'Centrocampista', (SELECT id FROM equipo WHERE nombre = 'Argentina')),
('Alexis Mac Allister', 'Centrocampista', (SELECT id FROM equipo WHERE nombre = 'Argentina')),
('Rodrigo De Paul', 'Centrocampista', (SELECT id FROM equipo WHERE nombre = 'Argentina')),
('Exequiel Palacios', 'Centrocampista', (SELECT id FROM equipo WHERE nombre = 'Argentina')),
('Enzo Fernández', 'Centrocampista', (SELECT id FROM equipo WHERE nombre = 'Argentina')),
('Giovani Lo Celso', 'Centrocampista',  (SELECT id FROM equipo WHERE nombre = 'Argentina')),
('Valentín Carboni', 'Centrocampista',  (SELECT id FROM equipo WHERE nombre = 'Argentina')),
-- Delanteros
('Ángel Di María', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Argentina')),
('Lionel Messi', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Argentina')),
('Ángel Correa', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Argentina')),
('Alejandro Garnacho', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Argentina')),
('Nicolás González', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Argentina')),
('Lautaro Martínez', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Argentina')),
('Julián Álvarez', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Argentina')),
-- Técnico
('Lionel Scaloni', 'Técnico', NULL, (SELECT id FROM equipo WHERE nombre = 'Argentina'));



INSERT INTO `plantel` (`nombre`, `posicion`, `numero_camiseta`, `equipo_id`)
VALUES
-- Arqueros
('Pedro Gallese', 'Portero', (SELECT id FROM equipo WHERE nombre = 'Perú')),
-- Defensas
('Luis Advíncula', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Perú')),
('Miguel Araujo', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Perú')),
('Alexander Callens', 'Defensa',(SELECT id FROM equipo WHERE nombre = 'Perú')),
('Marcos López', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Perú')),
('Anderson Santamaría', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Perú')),
('Oliver Sonne', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Perú')),
('Luis Abram', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Perú')),
-- Volantes
('Wilder Cartagena', 'Volante', (SELECT id FROM equipo WHERE nombre = 'Perú')),
('Jesús Castillo', 'Volante',  (SELECT id FROM equipo WHERE nombre = 'Perú')),
('Sergio Peña', 'Volante',  (SELECT id FROM equipo WHERE nombre = 'Perú')),
('Pedro Quispe', 'Volante', (SELECT id FROM equipo WHERE nombre = 'Perú')),
('Renato Tapia', 'Volante', (SELECT id FROM equipo WHERE nombre = 'Perú')),
-- Delanteros
('André Carrillo', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Perú')),
('Gianluca Lapadula', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Perú')),
('Bryan Reyna', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Perú')),
-- Técnico
('Jorge Fossati', 'Técnico', (SELECT id FROM equipo WHERE nombre = 'Perú'));



-- Insert Chile team
INSERT INTO `plantel` (`nombre`, `posicion`, `equipo_id`) VALUES
('Ricardo Gareca', 'Tecnico', (SELECT id FROM equipo WHERE nombre = 'Chile')),
-- Arqueros
('Claudio Bravo', 'Arquero', (SELECT id FROM equipo WHERE nombre = 'Chile')),
('Gabriel Arias', 'Arquero', (SELECT id FROM equipo WHERE nombre = 'Chile')),
('Brayan Cortés', 'Arquero', (SELECT id FROM equipo WHERE nombre = 'Chile')),
-- Defensores
('Matías Catalán', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Chile')),
('Paulo Díaz', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Chile')),
('Thomas Galdames', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Chile')),
('Mauricio Isla', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Chile')),
('Igor Lichnovsky', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Chile')),
('Felipe Loyola', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Chile')),
('Guillermo Maripán', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Chile')),
('Gabriel Suazo', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Chile')),
-- Volantes
('Rodrigo Echeverría', 'Volante', (SELECT id FROM equipo WHERE nombre = 'Chile')),
('Erick Pulgar', 'Volante', (SELECT id FROM equipo WHERE nombre = 'Chile')),
('Diego Valdés', 'Volante', (SELECT id FROM equipo WHERE nombre = 'Chile')),
('Marcelino Nuñez', 'Volante', (SELECT id FROM equipo WHERE nombre = 'Chile')),
('César Pérez', 'Volante', (SELECT id FROM equipo WHERE nombre = 'Chile')),
-- Delanteros
('Ben Brereton', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Chile')),
('Alexis Sánchez', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Chile')),
('Eduardo Vargas', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Chile')),
('Maximiliano Guerrero', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Chile')),
('Cristian Zavala', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Chile')),
('Marcos Bolados', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Chile')),
('Víctor Dávila', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Chile')),
('Darío Osorio', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Chile'));


-- Insert Mexico team
INSERT INTO `plantel` (`nombre`, `posicion`, `equipo_id`) VALUES
('Jaime Lozano', 'Tecnico', (SELECT id FROM equipo WHERE nombre = 'Mexico')),
-- Porteros
('Ángel Malagón', 'Portero', (SELECT id FROM equipo WHERE nombre = 'Mexico')),
('Tala Rangel', 'Portero', (SELECT id FROM equipo WHERE nombre = 'Mexico')),
('Julio González', 'Portero', (SELECT id FROM equipo WHERE nombre = 'Mexico')),
-- Defensas
('Israel Reyes', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Mexico')),
('Jorge Sánchez', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Mexico')),
('Brian García', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Mexico')),
('César Montes', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Mexico')),
('Victor Guzmán', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Mexico')),
('Alexis Peña', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Mexico')),
('Johan Vásquez', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Mexico')),
('Chiquete Orozco', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Mexico')),
('Gerardo Arteaga', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Mexico')),
('Bryan González', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Mexico')),
-- Medios
('Edson Álvarez', 'Medio', (SELECT id FROM equipo WHERE nombre = 'Mexico')),
('Luis Romo', 'Medio', (SELECT id FROM equipo WHERE nombre = 'Mexico')),
('Jordan Carrillo', 'Medio', (SELECT id FROM equipo WHERE nombre = 'Mexico')),
('Erick Sánchez', 'Medio', (SELECT id FROM equipo WHERE nombre = 'Mexico')),
('Orbelín Pineda', 'Medio', (SELECT id FROM equipo WHERE nombre = 'Mexico')),
('Roberto Alvarado', 'Medio', (SELECT id FROM equipo WHERE nombre = 'Mexico')),
('Luis Chávez', 'Medio', (SELECT id FROM equipo WHERE nombre = 'Mexico')),
('Ángel Montaño', 'Medio', (SELECT id FROM equipo WHERE nombre = 'Mexico')),
('Fernando Beltrán', 'Medio', (SELECT id FROM equipo WHERE nombre = 'Mexico')),
('Carlos Rodríguez', 'Medio', (SELECT id FROM equipo WHERE nombre = 'Mexico')),
-- Delanteros
('Marcelo Flores', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Mexico')),
('César Huerta', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Mexico')),
('Julian Quiñones', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Mexico')),
('Santiago Giménez', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Mexico')),
('Alexis Vega', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Mexico')),
('Uriel Antuna', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Mexico')),
('Guillermo Martínez', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Mexico')),
('Diego Lainez', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Mexico'));


-- Insert Ecuador team
INSERT INTO `plantel` (`nombre`, `posicion`, `equipo_id`) VALUES
('Félix Sánchez Bas', 'Tecnico', (SELECT id FROM equipo WHERE nombre = 'Ecuador')),
-- Arqueros
('Alexander Domínguez', 'Arquero', (SELECT id FROM equipo WHERE nombre = 'Ecuador')),
('Hernán Galíndez', 'Arquero', (SELECT id FROM equipo WHERE nombre = 'Ecuador')),
('Moisés Ramírez', 'Arquero', (SELECT id FROM equipo WHERE nombre = 'Ecuador')),
-- Defensores
('Félix Torres', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Ecuador')),
('José Hurtado', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Ecuador')),
('Ángelo Preciado', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Ecuador')),
('William Pacho', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Ecuador')),
('Piero Hincapié', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Ecuador')),
('Joel Ordóñez', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Ecuador')),
('Ángelo Preciado', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Ecuador')),
('Andrés Micolta', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Ecuador')),
('Layan Loor', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Ecuador')),
-- Volantes
('José Cifuentes', 'Volante', (SELECT id FROM equipo WHERE nombre = 'Ecuador')),
('Kendry Páez', 'Volante', (SELECT id FROM equipo WHERE nombre = 'Ecuador')),
('Joao Ortiz', 'Volante', (SELECT id FROM equipo WHERE nombre = 'Ecuador')),
('Carlos Gruezo', 'Volante', (SELECT id FROM equipo WHERE nombre = 'Ecuador')),
('Ángel Mena', 'Volante', (SELECT id FROM equipo WHERE nombre = 'Ecuador')),
('Alan Franco', 'Volante', (SELECT id FROM equipo WHERE nombre = 'Ecuador')),
('Moisés Caicedo', 'Volante', (SELECT id FROM equipo WHERE nombre = 'Ecuador')),
('Alan Minda', 'Volante', (SELECT id FROM equipo WHERE nombre = 'Ecuador')),
('Jeremy Sarmiento', 'Volante', (SELECT id FROM equipo WHERE nombre = 'Ecuador')),
('John Yeboah', 'Volante', (SELECT id FROM equipo WHERE nombre = 'Ecuador')),
('Janner Corozo', 'Volante', (SELECT id FROM equipo WHERE nombre = 'Ecuador')),
-- Delanteros
('Enner Valencia', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Ecuador')),
('Jordy Caicedo', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Ecuador')),
('Kevin Rodríguez', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Ecuador'));



-- Insert USA team
INSERT INTO `plantel` (`nombre`, `posicion`, `equipo_id`) VALUES
('Gregg Matthew Berhalter', 'Tecnico', (SELECT id FROM equipo WHERE nombre = 'Estados Unidos')),
-- Arqueros
('Ethan Horvath', 'Arquero', (SELECT id FROM equipo WHERE nombre = 'Estados Unidos')),
('Sean Johnson', 'Arquero', (SELECT id FROM equipo WHERE nombre = 'Estados Unidos')),
('Matt Turner', 'Arquero', (SELECT id FROM equipo WHERE nombre = 'Estados Unidos')),
-- Defensores
('Cameron Carter-Vickers', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Estados Unidos')),
('Kristoffer Lund', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Estados Unidos')),
('Mark McKenzie', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Estados Unidos')),
('Shaq Moore', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Estados Unidos')),
('Tim Ream', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Estados Unidos')),
('Chris Richards', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Estados Unidos')),
('Antonee Robinson', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Estados Unidos')),
('Miles Robinson', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Estados Unidos')),
('Joe Scally', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Estados Unidos')),
-- Volantes
('Tyler Adams', 'Volante', (SELECT id FROM equipo WHERE nombre = 'Estados Unidos')),
('Johnny Cardoso', 'Volante', (SELECT id FROM equipo WHERE nombre = 'Estados Unidos')),
('Luca de la Torre', 'Volante', (SELECT id FROM equipo WHERE nombre = 'Estados Unidos')),
('Weston McKennie', 'Volante', (SELECT id FROM equipo WHERE nombre = 'Estados Unidos')),
('Yunus Musah', 'Volante', (SELECT id FROM equipo WHERE nombre = 'Estados Unidos')),
('Gio Reyna', 'Volante', (SELECT id FROM equipo WHERE nombre = 'Estados Unidos')),
('Malik Tillman', 'Volante', (SELECT id FROM equipo WHERE nombre = 'Estados Unidos')),
('Timmy Tillman', 'Volante', (SELECT id FROM equipo WHERE nombre = 'Estados Unidos')),
-- Delanteros
('Brenden Aaronson', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Estados Unidos')),
('Folarin Balogun', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Estados Unidos')),
('Ricardo Pepi', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Estados Unidos')),
('Christian Pulisic', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Estados Unidos')),
('Josh Sargent', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Estados Unidos')),
('Tim Weah', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Estados Unidos')),
('Haji Wright', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Estados Unidos'));



-- Insert Brazil team
INSERT INTO `plantel` (`nombre`, `posicion`, `equipo_id`) VALUES
('Dorival Junior', 'Tecnico', (SELECT id FROM equipo WHERE nombre = 'Brasil')),
-- Arqueros
('Alisson', 'Arquero', (SELECT id FROM equipo WHERE nombre = 'Brasil')),
('Bento', 'Arquero', (SELECT id FROM equipo WHERE nombre = 'Brasil')),
('Rafael', 'Arquero', (SELECT id FROM equipo WHERE nombre = 'Brasil')),
-- Defensores
('Danilo', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Brasil')),
('Yan Couto', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Brasil')),
('Guilherme Arana', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Brasil')),
('Wendell', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Brasil')),
('Beraldo', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Brasil')),
('Éder Militão', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Brasil')),
('Gabriel Magalhães', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Brasil')),
('Marquinhos', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Brasil')),
('Bremer', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Brasil')),
-- Volantes
('Andreas Pereira', 'Volante', (SELECT id FROM equipo WHERE nombre = 'Brasil')),
('Bruno Guimarães', 'Volante', (SELECT id FROM equipo WHERE nombre = 'Brasil')),
('Douglas Luiz', 'Volante', (SELECT id FROM equipo WHERE nombre = 'Brasil')),
('João Gomes', 'Volante', (SELECT id FROM equipo WHERE nombre = 'Brasil')),
('Lucas Paquetá', 'Volante', (SELECT id FROM equipo WHERE nombre = 'Brasil')),
('Éderson', 'Volante', (SELECT id FROM equipo WHERE nombre = 'Brasil')),
-- Delanteros
('Endrick', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Brasil')),
('Evanilson', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Brasil')),
('Gabriel Martinelli', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Brasil')),
('Raphinha', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Brasil')),
('Rodrygo Goes', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Brasil')),
('Savinho', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Brasil')),
('Vinícius Júnior', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Brasil')),
('Pepê', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Brasil'));



-- Insertar jugadores de Venezuela
INSERT INTO `plantel` (`nombre`, `posicion`, `equipo_id`) VALUES
('Fernando Batista', 'Tecnico', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Rafael Romo', 'Portero', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Joel Graterol', 'Portero', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('José David Contreras', 'Portero', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Alain Baroja', 'Portero', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Wuilker Faríñez', 'Portero', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Alexander González', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Jon Aramburu', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Nahuel Ferraresi', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Yordan Osorio', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Carlos Vivas', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Diego Luna', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Wilker Ángel', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Christian Makoun', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Teo Quintero', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Jhon Chancellor', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Miguel Navarro', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Renné Rivas', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Roberto Rosales', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Delvin Alfonzo', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('José Andrés Martínez', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Cristian Cásseres', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Jesús Bueno', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Bryant Ortega', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Junior Moreno', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Yangel Herrera', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Daniel Pereira', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Tomás Rincón', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Edson Castillo', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Telasco Segovia', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Samuel Sosa', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Eduard Bello', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Kervin Andrade', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Jovanny Bolívar', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Darwin Machís', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Jhon Murillo', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Rómulo Otero', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Matías Lacava', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Yeferson Soteldo', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Jefferson Savarino', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Enrique Peña Zauner', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Josef Martínez', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Freddy Vargas', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Salomón Rondón', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Jhonder Cádiz', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Eric Ramírez', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Sergio Córdova', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Venezuela')),
('Alejandro Marqués', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Venezuela'));


-- Insertar jugadores de Canadá
INSERT INTO `plantel` (`nombre`, `posicion`, `equipo_id`) VALUES
('Jesse Marsch', 'Tecnico', (SELECT id FROM equipo WHERE nombre = 'Canada')),
('Maxime Crépeau', 'Portero', (SELECT id FROM equipo WHERE nombre = 'Canada')),
('Thomas McGill', 'Portero', (SELECT id FROM equipo WHERE nombre = 'Canada')),
('Dayne St. Clair', 'Portero', (SELECT id FROM equipo WHERE nombre = 'Canada')),
('Grégoire Swiderski', 'Portero', (SELECT id FROM equipo WHERE nombre = 'Canada')),
('Moïse Bombito', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Canada')),
('Derek Cornelius', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Canada')),
('Alphonso Davies', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Canada')),
('Luc de Fougerolles', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Canada')),
('Kyle Hiebert', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Canada')),
('Alistair Johnston', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Canada')),
('Richie Laryea', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Canada')),
('Kamal Miller', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Canada')),
('Dominick Zator', 'Defensor', (SELECT id FROM equipo WHERE nombre = 'Canada')),
('Mathieu Choinière', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Canada')),
('Stephen Eustáquio', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Canada')),
('Ismaël Koném', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Canada')),
('Jonathan Osorio', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Canada')),
('Samuel Piette', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Canada')),
('Thelonius Bair', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Canada')),
('Charles-Andreas Brym', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Canada')),
('Jonathan David', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Canada')),
('Junior Hoilett', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Canada')),
('Cyle Larin', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Canada')),
('Liam Millar', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Canada')),
('Jacob Shaffelburg', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Canada')),
('Iké Ugbo', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Canada'));


-- Insertar jugadores de Jamaica
INSERT INTO `plantel` (`nombre`, `posicion`, `equipo_id`) VALUES
('Heimir Hallgrimsson', 'Tecnico', (SELECT id FROM equipo WHERE nombre = 'Jamaica')),
('Andre Blake', 'Portero', (SELECT id FROM equipo WHERE nombre = 'Jamaica')),
('Jahmali Waite', 'Portero', (SELECT id FROM equipo WHERE nombre = 'Jamaica')),
('Shaquan Davis', 'Portero', (SELECT id FROM equipo WHERE nombre = 'Jamaica')),
('Damion Lowe', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Jamaica')),
('Michael Hector', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Jamaica')),
('Richard King', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Jamaica')),
('Dexter Lembikisa', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Jamaica')),
('Greg Leigh', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Jamaica')),
('Di’Shon Bernard', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Jamaica')),
('Tayvon Gray', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Jamaica')),
('Adrian Mariappa', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Jamaica')),
('Alvas Powell', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Jamaica')),
('Renaldo Cephas', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Jamaica')),
('Shamar Nicholson', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Jamaica')),
('Cory Burke', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Jamaica')),
('Romario Williams Hartford Athletic', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Jamaica')),
('Demarai Gray', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Jamaica')),
('Jamal Lowe', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Jamaica')),
('Kaheim Dixon', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Jamaica')),
('Bobby Decordova-Reid', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Jamaica')),
('Daniel Johnson', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Jamaica')),
('Joel Latibeaudiere', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Jamaica')),
('Kasey Palmer', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Jamaica')),
('Karoy Anderson', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Jamaica')),
('Devon Williams', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Jamaica')),
('Kevon Lambert', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Jamaica'));


-- Insertar jugadores de Uruguay
INSERT INTO `plantel` (`nombre`, `posicion`, `equipo_id`) VALUES
('Marcelo Bielsa', 'Tecnico', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Sergio Rochet', 'Portero', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Santiago Mele', 'Portero', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Guillermo de Amores', 'Portero', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Randall Rodríguez', 'Portero', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Nicolás Marichal', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Ronald Araújo', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Santiago Bueno', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('José María Giménez', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Mathias Olivera', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Marcelo Saracchi', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Joaquín Piquerez', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Lucas Olaza', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Guillermo Varela', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('José Luis Rodríguez', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Matías Viña', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Rodrigo Bentancur', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Manuel Ugarte', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Federico Valverde', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Nahitan Nández', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Nicolás de la Cruz', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Giorgian de Arrascaeta', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Matías Vecino', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Rodrigo Zalazar', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Nicolás Fonseca', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Agustín Canobbio', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Luis Suárez', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Edinson Cavani', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Maxi Araujo', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Facundo Pellistri', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Cristian Olivera', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Luciano Rodríguez', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Brian Ocampo', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Darwin Núñez', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Federico Viñas', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Brian Rodríguez', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Uruguay')),
('Ignacio Laquintana', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Uruguay'));


-- Insertar jugadores de Panamá
INSERT INTO `plantel` (`nombre`, `posicion`, `equipo_id`) VALUES
('Thomas Christiansen', 'Tecnico', (SELECT id FROM equipo WHERE nombre = 'Panama')),
('Orlando Mosquera', 'Portero', (SELECT id FROM equipo WHERE nombre = 'Panama')),
('Eddie Roberts', 'Portero', (SELECT id FROM equipo WHERE nombre = 'Panama')),
('Andrés Andrade', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Panama')),
('Eric Davis', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Panama')),
('Michael Murillo', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Panama')),
('César Blackman', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Panama')),
('Edgardo Fariña', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Panama')),
('Roderick Miller', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Panama')),
('Orman Davis', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Panama')),
('Sergio Ramírez', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Panama')),
('Gabriel Brown', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Panama')),
('José Luis Rodríguez', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Panama')),
('Édgar Bárcenas', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Panama')),
('Héctor Hurtado', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Panama')),
('Jovani Welch', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Panama')),
('Kahiser Lenis', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Panama')),
('Freddy Góndola', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Panama')),
('Josiel Nuñez', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Panama')),
('Alfredo Stephens', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Panama')),
('Tomás Rodríguez', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Panama'));


-- Insertar jugadores de Bolivia
INSERT INTO `plantel` (`nombre`, `posicion`, `equipo_id`) VALUES
('Antonio Carlos Zago', 'Tecnico', (SELECT id FROM equipo WHERE nombre = 'Bolivia')),
('Carlos Lampe', 'Portero', (SELECT id FROM equipo WHERE nombre = 'Bolivia')),
('David Akologo', 'Portero', (SELECT id FROM equipo WHERE nombre = 'Bolivia')),
('Gustavo Almada', 'Portero', (SELECT id FROM equipo WHERE nombre = 'Bolivia')),
('Jesús Sagredo', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Bolivia')),
('Jairo Quinteros', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Bolivia')),
('Sebastián Álvarez', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Bolivia')),
('César Romero', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Bolivia')),
('Erwin Saavedra', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Bolivia')),
('Yomar Rocha', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Bolivia')),
('Denilson Durán', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Bolivia')),
('José Sagredo', 'Defensa', (SELECT id FROM equipo WHERE nombre = 'Bolivia')),
('Leonel Justiniano', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Bolivia')),
('José Verdecio', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Bolivia')),
('Boris Céspedes', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Bolivia')),
('Moisés Villarroel', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Bolivia')),
('Carlos Sejas', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Bolivia')),
('Gustavo Mendoza', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Bolivia')),
('Lucas Chavez', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Bolivia')),
('Ramiro Vaca', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Bolivia')),
('Miguel Terceros', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Bolivia')),
('Miguel Villarroel', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Bolivia')),
('Juan Magallanes', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Bolivia')),
('Mirko Tomianovic', 'Mediocampista', (SELECT id FROM equipo WHERE nombre = 'Bolivia')),
('César Menacho', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Bolivia')),
('Carmelo Algarañaz', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Bolivia')),
('Jair Reinoso', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Bolivia')),
('Gabriel Sotomayor', 'Delantero', (SELECT id FROM equipo WHERE nombre = 'Bolivia'));



-- insert vs 



-- Fase de grupos - Jornada 1 de 3
INSERT INTO `compite` (`fecha`, `hora`, `equipo_local`, `equipo_visitante`) VALUES
('2024-06-20', '21:00', 'Argentina', 'Canadá'), 
('2024-06-21', '21:00', 'Chile', 'Perú'),
('2024-06-22', '19:00', 'Ecuador', 'Venezuela'),
('2024-06-22', '22:00', 'México', 'Jamaica'),
('2024-06-23', '19:00', 'Estados Unidos', 'Bolivia'),
('2024-06-23', '22:00', 'Uruguay', 'Panamá'),
('2024-06-24', '19:00', 'Colombia', 'Paraguay'),
('2024-06-24', '22:00', 'Brasil', 'Costa Rica');

-- Fase de grupos - Jornada 2 de 3
INSERT INTO `compite` (`fecha`, `hora`, `equipo_local`, `equipo_visitante`) VALUES
('2024-06-25', '19:00', 'Canadá', 'Perú'),
('2024-06-25', '22:00', 'Chile', 'Argentina'),
('2024-06-26', '19:00', 'Ecuador', 'Jamaica'),
('2024-06-26', '22:00', 'México', 'Venezuela'),
('2024-06-27', '19:00', 'Panamá', 'Estados Unidos'),
('2024-06-27', '22:00', 'Uruguay', 'Bolivia'),
('2024-06-28', '19:00', 'Colombia', 'Costa Rica'),
('2024-06-28', '22:00', 'Brasil', 'Paraguay');

-- Fase de grupos - Jornada 3 de 3
INSERT INTO `compite` (`fecha`, `hora`, `equipo_local`, `equipo_visitante`) VALUES
('2024-06-29', '21:00', 'Argentina', 'Perú'),
('2024-06-29', '21:00', 'Canadá', 'Chile'),
('2024-06-30', '21:00', 'México', 'Ecuador'),
('2024-06-30', '21:00', 'Jamaica', 'Venezuela'),
('2024-07-01', '22:00', 'Bolivia', 'Panamá'),
('2024-07-01', '22:00', 'Estados Unidos', 'Uruguay'),
('2024-07-02', '22:00', 'Brasil', 'Colombia'),
('2024-07-02', '22:00', 'Paraguay', 'Costa Rica');

-- cuartos de final
INSERT INTO `compite` (`fecha`, `hora`, `equipo_local`, `equipo_visitante`) VALUES
('2024-07-04', '22:00', 'Por definirse', 'Por definirse'),
('2024-07-05', '22:00', 'Por definirse', 'Por definirse'),
('2024-07-06', '19:00', 'Por definirse', 'Por definirse'),
('2024-07-06', '22:00', 'Por definirse', 'Por definirse');


-- Semifinal
INSERT INTO `compite` (`fecha`, `hora`, `equipo_local`, `equipo_visitante`) VALUES
('2024-07-09', '21:00', 'Por definirse', 'Por definirse'),
('2024-07-10', '21:00', 'Por definirse', 'Por definirse');



USE `pencaucu`;
DELETE FROM prediccion_campeonato;
DELETE FROM alumno;
DELETE FROM login;
DELETE FROM usuario;
USE `pencaucu`;
SELECT * FROM prediccion_campeonato;
SELECT * FROM alumno;
SELECT * FROM login;
SELECT * FROM usuario;



