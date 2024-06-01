const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors()); 

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
  const query = `
    SELECT l.password, u.rol 
    FROM login l 
    JOIN usuario u ON l.documento_usuario = u.documento 
    WHERE l.username = ?`;
   
  connection.query(query, [username], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length > 0) {
      const hashedPassword = results[0].password;
      const userRole = results[0].rol;

      // Comparar la contraseña hasheada
      bcrypt.compare(password, hashedPassword, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ error: 'Error comparing passwords' });
        }
        if (isMatch) {
          // Usuario autenticado correctamente
          res.status(200).json({ message: 'Login successful', role: userRole });
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
