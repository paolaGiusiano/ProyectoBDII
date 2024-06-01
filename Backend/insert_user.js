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

  const password = 'test123';
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;

    const query = 'INSERT INTO users (username, password) VALUES (?, ?) ON DUPLICATE KEY UPDATE password = VALUES(password)';
    const values = ['test.user', hash];

    connection.query(query, values, (err, result) => {
      if (err) throw err;
      console.log('Usuario insertado con contraseña hasheada.');
      connection.end();
    });
  });
});
