CREATE DATABASE IF NOT EXISTS `pencaucu`;

USE `pencaucu`;

CREATE TABLE IF NOT EXISTS `login` (
  `username` varchar(100) NOT NULL PRIMARY KEY,
  `password` varchar(255) NOT NULL
);

USE `pencaucu`;
INSERT INTO `login` (`username`, `password`) 
VALUES ('test.user', '$2b$10$BUGEwwF5kXguL205h/1OxOOrQ3bnoIeTAJ/1Aaq7AJbef62Lh2erm'); 


USE `pencaucu`;
SELECT * FROM login WHERE username = 'test.user';

