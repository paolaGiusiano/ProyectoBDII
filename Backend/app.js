// Importar los módulos necesarios
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

// Crear la aplicación Express
const app = express();
const port = 3000;

// Configurar la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  port: 3306,
  database: 'pencaucu'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

// Función para ejecutar consultas con promesas
function queryPromise(sql, args) {
  return new Promise((resolve, reject) => {
    connection.query(sql, args, (err, rows) => {
      if (err)
        return reject(err);
      resolve(rows);
    });
  });
}

// Configurar middlewares
app.use(cors());
app.use(bodyParser.json());

// Exportar la conexión y la función de consulta
module.exports = {
  connection,
  queryPromise,
  app
};
