/*const bcrypt = require('bcrypt');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pencaucu'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos.');

  const users = [
    { username: 'paola.giusiano', password: 'paola123' },
    { username: 'pepe.gomez', password: 'pepe123' },
    { username: 'test.user', password: 'test123' }
  ];

  users.forEach(user => {
    bcrypt.hash(user.password, 10, (err, hash) => {
      if (err) throw err;

      const query = 'INSERT INTO login (username, password) VALUES (?, ?) ON DUPLICATE KEY UPDATE password = VALUES(password)';
      const values = [user.username, hash];

      connection.query(query, values, (err, result) => {
        if (err) throw err;
        console.log(`Usuario ${user.username} insertado con contraseña hasheada.`);
        if (user === users[users.length - 1]) {
          connection.end();
        }
      });
    });
  });
});
*/


const bcrypt = require('bcrypt');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pencaucu'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos.');

  const users = [
    { username: 'paola.giusiano', password: 'paola123', documento: '12345678' },
    { username: 'pepe.gomez', password: 'pepe123', documento: '87654321' },
    { username: 'test.user', password: 'test123', documento: '11223344' }
  ];

  users.forEach(user => {
    bcrypt.hash(user.password, 10, (err, hash) => {
      if (err) throw err;

      const query = 'INSERT INTO login (username, password, documento_usuario) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE password = VALUES(password)';
      const values = [user.username, hash, user.documento];

      connection.query(query, values, (err, result) => {
        if (err) throw err;
        console.log(`Usuario ${user.username} insertado con contraseña hasheada.`);
        if (user === users[users.length - 1]) {
          connection.end();
        }
      });
    });
  });
});
