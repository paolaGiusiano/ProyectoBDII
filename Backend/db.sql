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
  `rol` varchar(20) NOT NULL, /*campo para el rol del usuario*/
  PRIMARY KEY (`documento`)
);


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


USE `pencaucu`;
SELECT * FROM login;
SELECT * FROM usuario;


