/*const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://localhost:4200' // Permitir solicitudes desde este origen
}));

app.use(bodyParser.json());

// Configurar la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  port: 3306,
  database: 'pencaucu'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Ruta para el login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM login WHERE username = ?';
  
  connection.query(query, [username], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length > 0) {
      const hashedPassword = results[0].password;

      // Comparar la contraseña hasheada
      bcrypt.compare(password, hashedPassword, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ error: 'Error comparing passwords' });
        }
        if (isMatch) {
          // Usuario autenticado correctamente
          res.status(200).json({ message: 'Login successful' });
        } else {
          // Contraseña incorrecta
          res.status(401).json({ message: 'Invalid username or password' });
        }
      });
    } else {
      // Usuario no encontrado
      res.status(401).json({ message: 'Invalid username or password' });
    }
  });
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
*/

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors()); // Permitir solicitudes desde cualquier origen

app.use(bodyParser.json());

// Configurar la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  port: 3306,
  database: 'pencaucu'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Ruta para el login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM login WHERE username = ?';
  
  connection.query(query, [username], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length > 0) {
      const hashedPassword = results[0].password;

      // Comparar la contraseña hasheada
      bcrypt.compare(password, hashedPassword, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ error: 'Error comparing passwords' });
        }
        if (isMatch) {
          // Usuario autenticado correctamente
          res.status(200).json({ message: 'Login successful' });
        } else {
          // Contraseña incorrecta
          res.status(401).json({ message: 'Invalid username or password' });
        }
      });
    } else {
      // Usuario no encontrado
      res.status(401).json({ message: 'Invalid username or password' });
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
