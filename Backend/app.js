/*
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


// Ruta para eliminar un usuario
app.delete('/user/:documento', (req, res) => {
  const documento = req.params.documento;

  const deleteLoginQuery = 'DELETE FROM login WHERE documento_usuario = ?';
  const deleteUserQuery = 'DELETE FROM usuario WHERE documento = ?';

  connection.query(deleteLoginQuery, [documento], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database error deleting login' });
    }

    connection.query(deleteUserQuery, [documento], (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Database error deleting user' });
      }

      res.status(200).json({ message: 'User deleted successfully' });
    });
  });
});

// Obtener los partidos próximos
app.get('/matches/upcoming', (req, res) => {
  const query = 'SELECT * FROM compite WHERE fecha > CURDATE()';
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Subir una predicción
app.post('/predicciones', (req, res) => {
  const { matchId, local, visitante } = req.body;
  const documento_usuario = '12345678'; // Este debería ser el documento del usuario logueado
  const query = 'INSERT INTO prediccion (documento_usuario, fecha_partido, local, visitante, prediccion_local, prediccion_visitante) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [documento_usuario, matchId.fecha, matchId.local, matchId.visitante, local, visitante];

  connection.query(query, values, (err, results) => {
    if (err) throw err;
    res.json({ message: 'Prediction added', id: results.insertId });
  });
});





// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


*/

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


// Ruta para eliminar un usuario
app.delete('/user/:documento', (req, res) => {
  const documento = req.params.documento;

  const deleteLoginQuery = 'DELETE FROM login WHERE documento_usuario = ?';
  const deleteUserQuery = 'DELETE FROM usuario WHERE documento = ?';

  connection.query(deleteLoginQuery, [documento], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database error deleting login' });
    }

    connection.query(deleteUserQuery, [documento], (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Database error deleting user' });
      }

      res.status(200).json({ message: 'User deleted successfully' });
    });
  });
});

// Obtener los partidos próximos
app.get('/matches/upcoming', (req, res) => {
  console.log('Request received for /matches/upcoming');  // Mensaje al recibir la solicitud
  const query = 'SELECT * FROM compite WHERE fecha >= CURDATE() ORDER BY fecha, hora';
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);  // Mensaje de error en la consulta
      res.status(500).send('Internal Server Error');
      return;
    }
    console.log('Query executed successfully:', results);  // Mensaje de éxito y resultados de la consulta
    res.json(results);
  });
});


// Subir una predicción
app.post('/predicciones', (req, res) => {
  const { matchId, local, visitante } = req.body;
  const documento_usuario = '12345678'; // Este debería ser el documento del usuario logueado
  const query = 'INSERT INTO prediccion (documento_usuario, fecha_partido, local, visitante, prediccion_local, prediccion_visitante) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [documento_usuario, matchId.fecha, matchId.local, matchId.visitante, local, visitante];

  connection.query(query, values, (err, results) => {
    if (err) throw err;
    res.json({ message: 'Prediction added', id: results.insertId });
  });
});





// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
