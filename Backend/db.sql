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
  `id` INT(100) NOT NULL AUTO_INCREMENT,
  `documento_alumno` VARCHAR(8) NOT NULL,
  `id_partido` INT NOT NULL,
  `prediccion_local` INT(11) NOT NULL,
  `prediccion_visitante` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`documento_alumno`) REFERENCES `alumno`(`documento`),
  FOREIGN KEY (`id_partido`) REFERENCES `compite`(`id`)
);


CREATE TABLE IF NOT EXISTS `prediccion_campeonato` (
  `documento_alumno` VARCHAR(8) PRIMARY KEY ,
  `campeon` VARCHAR(50) NOT NULL,
  `subcampeon` VARCHAR(50) NOT NULL,
  FOREIGN KEY (`documento_alumno`) REFERENCES `alumno`(`documento`),
  FOREIGN KEY (`campeon`) REFERENCES `equipo`(`pais`),
  FOREIGN KEY (`subcampeon`) REFERENCES `equipo`(`pais`)
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
    `documento_alumno` varchar(8) PRIMARY KEY,
    `puntaje_total`  INT,
    UNIQUE(`documento_alumno`),
    FOREIGN KEY (`documento_alumno` ) REFERENCES `alumno`(`documento` )
);



CREATE TABLE IF NOT EXISTS `premio` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);





INSERT INTO `usuario` (`documento`, `nombre`, `apellido`, `pais_nacimiento`, `email`)
VALUES
('34875244', 'Pepe', 'Gomez', 'Uruguay', 'pepegomez@gmail.com');


INSERT INTO `administrador` (`documento`)
VALUES
('34875244');

INSERT INTO `login` (`username`, `password`, `documento_usuario`)
VALUES
('pepe.gomez', 'pepe123', '34875244');





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



-- insert vs 



USE `pencaucu`;
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
-- Final
INSERT INTO `compite` (`fecha`, `hora`, `equipo_local`, `equipo_visitante`) VALUES
('2024-07-14', '21:00', 'Por definirse', 'Por definirse');



USE `pencaucu`;
DELETE FROM `prediccion`
WHERE `id_partido` = 7;



USE `pencaucu`;
DELETE FROM resultado;
DELETE FROM compite;
DELETE FROM usuario;

USE `pencaucu`;
SELECT * FROM compite;
SELECT * FROM resultado;
SELECT * FROM usuario;



