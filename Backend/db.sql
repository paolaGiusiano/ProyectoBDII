CREATE DATABASE IF NOT EXISTS `pencaucu`;

USE `pencaucu`;


CREATE TABLE IF NOT EXISTS `login` (
  `username` varchar(100) NOT NULL PRIMARY KEY,
  `password` varchar(255) NOT NULL,
  `documento_usuario` varchar(8) NOT NULL,
  FOREIGN KEY (`documento_usuario`) REFERENCES `usuario`(`documento`)
);


CREATE TABLE IF NOT EXISTS `usuario` (
  `documento` varchar(8) NOT NULL,
  `nombre` varchar(40) NOT NULL,
  `apellido` varchar(40) NOT NULL,
  `pais_nacimiento` varchar(40) NOT NULL,
  `rol` varchar(20) NOT NULL, 
  PRIMARY KEY (`documento`)
);


CREATE TABLE IF NOT EXISTS `prediccion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `documento_usuario` varchar(8) NOT NULL,
  `fecha_partido` date NOT NULL,
  `local` varchar(20) NOT NULL,
  `visitante` varchar(20) NOT NULL,
  `prediccion_local` int(11) NOT NULL,
  `prediccion_visitante` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`documento_usuario`) REFERENCES `usuario`(`documento`)
);


CREATE TABLE IF NOT EXISTS `equipo` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(50) NOT NULL
);


CREATE TABLE IF NOT EXISTS `compite` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `fecha` DATE NOT NULL,
  `hora` TIME NOT NULL,
  `equipo_local` INT NOT NULL,
  `equipo_visitante` INT NOT NULL,
  FOREIGN KEY (`equipo_local`) REFERENCES `equipo` (`id`),
  FOREIGN KEY (`equipo_visitante`) REFERENCES `equipo` (`id`)
);


CREATE TABLE IF NOT EXISTS `plantel` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL,
  `posicion` VARCHAR(50) NOT NULL,
  `numero_camiseta` INT NOT NULL,
  `equipo_id` INT NOT NULL,
  FOREIGN KEY (`equipo_id`) REFERENCES `equipo`(`id`)
);


------------------------------------------------------------------------------------


USE `pencaucu`;

INSERT INTO `usuario` (`documento`, `nombre`, `apellido`, `pais_nacimiento`, `rol`)
VALUES
('12345678', 'Paola', 'Giusiano', 'Uruguay', 'alumno'),
('87654321', 'Pepe', 'Gomez', 'Argentina', 'administrador'),
('11223344', 'Test', 'User', 'Pais3', 'alumno');

INSERT INTO `login` (`username`, `password`, `documento_usuario`) 
VALUES ('paola.giusiano', '$2b$10$9QSGpaUKyZc6DjKRSUiJYuYGa8216jflsDf3GyomOHtw/e1BakcMu', '12345678');

INSERT INTO `login` (`username`, `password`, `documento_usuario`) 
VALUES ('pepe.gomez', '$2b$10$nVAgV5kECObED7VLQNSIc.3ifPg/2Mx/hjaoIyxLxbePPxG.rrIdS', '87654321');

INSERT INTO `login` (`username`, `password`, `documento_usuario`) 
VALUES ('test.user', '$2b$10$BUGEwwF5kXguL205h/1OxOOrQ3bnoIeTAJ/1Aaq7AJbef62Lh2erm', '11223344');



-- INSERTAR LOS EQUIPOS 
USE `pencaucu`;

INSERT INTO `equipo` (`nombre`) VALUES
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



USE `pencaucu`;
SELECT * FROM login;
SELECT * FROM usuario;
SELECT * FROM equipo;


