const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
const port = 3000;
const router = express.Router();

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
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});


// Ruta para el login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = `
    SELECT l.password, u.rol, u.documento
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
      const documento = results[0].documento;

      bcrypt.compare(password, hashedPassword, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ error: 'Error comparing passwords' });
        }
        if (isMatch) {
          res.status(200).json({ message: 'Login successful', role: userRole, documento: documento });
        } else {
          res.status(401).json({ message: 'Invalid username or password' });
        }
      });
    } else {
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
      console.error('Database error deleting login:', error);
      return res.status(500).json({ error: 'Database error deleting login' });
    }

    connection.query(deleteUserQuery, [documento], (error, results) => {
      if (error) {
        console.error('Database error deleting user:', error);
        return res.status(500).json({ error: 'Database error deleting user' });
      }

      res.status(200).json({ message: 'User deleted successfully' });
    });
  });
});




// Obtener los partidos próximos
app.get('/matches/upcoming', (req, res) => {
  const query = 'SELECT * FROM compite WHERE fecha >= CURDATE() ORDER BY fecha, hora';
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).send('Internal Server Error');
    }
    console.log('Query executed successfully:', results);
    res.json(results);
  });
});




app.post('/predictions', (req, res) => {
  const { id_partido, prediccion_local, prediccion_visitante, campeon, subcampeon } = req.body;
  const documento_alumno = req.body.documento_alumno || req.headers['documento'] || null;

  // Validación de datos
  if (!documento_alumno || !id_partido || prediccion_local === undefined || prediccion_visitante === undefined || !campeon || !subcampeon) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const insertPredictionQuery = `
    INSERT INTO prediccion (documento_alumno, id_partido, prediccion_local, prediccion_visitante)
    VALUES (?, ?, ?, ?)
  `;

  const insertPredictionChampionshipQuery = `
    INSERT INTO prediccion_campeonato (documento_alumno, campeon, subcampeon)
    VALUES (?, ?, ?)
  `;

  // Inserta la predicción del partido
  connection.query(insertPredictionQuery, [documento_alumno, id_partido, prediccion_local, prediccion_visitante], (error, results) => {
    if (error) {
      console.error('Error de base de datos al guardar la predicción:', error.sqlMessage);
      return res.status(500).json({ error: 'Error de base de datos al guardar la predicción', details: error.sqlMessage });
    }

    // Inserta la predicción del campeonato
    connection.query(insertPredictionChampionshipQuery, [documento_alumno, campeon, subcampeon], (error, results) => {
      if (error) {
        console.error('Error de base de datos al guardar la predicción del campeonato:', error.sqlMessage);
        return res.status(500).json({ error: 'Error de base de datos al guardar la predicción del campeonato', details: error.sqlMessage });
      }

      res.status(200).json({ message: 'Predicción guardada con éxito' });
    });
  });
});


// Ruta para guardar predicción del campeonato
app.post('/championship-predictions', (req, res) => {
  const { documento_alumno, campeon, subcampeon } = req.body;

  // Validación de datos
  if (!documento_alumno || !campeon || !subcampeon) {
    return res.status(400).json({ error: 'Faltan campos obligatorios campeonato' });
  }

  const insertPredictionChampionshipQuery = `
    INSERT INTO prediccion_campeonato (documento_alumno, campeon, subcampeon)
    VALUES (?, ?, ?)
  `;

  // Inserta la predicción del campeonato
  connection.query(insertPredictionChampionshipQuery, [documento_alumno, campeon, subcampeon], (error, results) => {
    if (error) {
      console.error('Error de base de datos al guardar la predicción del campeonato:', error.sqlMessage);
      return res.status(500).json({ error: 'Error de base de datos al guardar la predicción del campeonato', details: error.sqlMessage });
    }

    res.status(200).json({ message: 'Predicción de campeonato guardada con éxito' });
  });
});


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
