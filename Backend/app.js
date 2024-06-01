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


// Ruta para agregar una predicción
app.post('/prediccion', (req, res) => {
  const { documento_usuario, fecha_partido, local, visitante, prediccion_local, prediccion_visitante } = req.body;

  const query = `
    INSERT INTO prediccion (documento_usuario, fecha_partido, local, visitante, prediccion_local, prediccion_visitante)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [documento_usuario, fecha_partido, local, visitante, prediccion_local, prediccion_visitante];

  connection.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database error adding prediction' });
    }

    res.status(200).json({ message: 'Prediction added successfully' });
  });
});

// Ruta para listar las predicciones de un usuario
app.get('/predicciones/:documento_usuario', (req, res) => {
  const documento_usuario = req.params.documento_usuario;

  const query = 'SELECT * FROM prediccion WHERE documento_usuario = ?';

  connection.query(query, [documento_usuario], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database error fetching predictions' });
    }

    res.status(200).json(results);
  });
});

// Ruta para actualizar una predicción
app.put('/prediccion/:id', (req, res) => {
  const id = req.params.id;
  const { prediccion_local, prediccion_visitante } = req.body;

  const query = `
    UPDATE prediccion
    SET prediccion_local = ?, prediccion_visitante = ?
    WHERE id = ?
  `;

  const values = [prediccion_local, prediccion_visitante, id];

  connection.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database error updating prediction' });
    }

    res.status(200).json({ message: 'Prediction updated successfully' });
  });
});

// Ruta para eliminar una predicción
app.delete('/prediccion/:id', (req, res) => {
  const id = req.params.id;

  const query = 'DELETE FROM prediccion WHERE id = ?';

  connection.query(query, [id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database error deleting prediction' });
    }

    res.status(200).json({ message: 'Prediction deleted successfully' });
  });
});


// Ruta para obtener la lista de partidos
app.get('/matches', (req, res) => {
  const query = 'SELECT id, name FROM matches'; // Reemplaza 'matches' con el nombre de tu tabla de partidos
  connection.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database error fetching matches' });
    }
    res.status(200).json(results);
  });
});



// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
