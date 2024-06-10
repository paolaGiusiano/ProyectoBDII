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
          // Insertar en la tabla correspondiente
          if (userRole === 'alumno') {
            insertAlumno(documento, (insertError) => {
              if (insertError) {
                return res.status(500).json({ error: 'Error inserting alumno' });
              }
              res.status(200).json({ message: 'Login successful', role: userRole, documento: documento });
            });
          } else if (userRole === 'administrador') {
            insertAdministrador(documento, (insertError) => {
              if (insertError) {
                return res.status(500).json({ error: 'Error inserting administrador' });
              }
              res.status(200).json({ message: 'Login successful', role: userRole, documento: documento });
            });
          } else {
            res.status(200).json({ message: 'Login successful', role: userRole, documento: documento });
          }
        } else {
          res.status(401).json({ message: 'Invalid username or password' });
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  });
});

function insertAlumno(documento, callback) {
  const checkQuery = 'SELECT * FROM alumno WHERE documento = ?';
  connection.query(checkQuery, [documento], (checkError, checkResults) => {
    if (checkError) return callback(checkError);
    if (checkResults.length > 0) return callback(null); // Ya está insertado

    const randomYear = Math.floor(Math.random() * (2024 - 2015 + 1)) + 2015;
    const randomCarreraQuery = 'SELECT id FROM carrerra ORDER BY RAND() LIMIT 1';

    connection.query(randomCarreraQuery, (carreraError, carreraResults) => {
      if (carreraError) return callback(carreraError);
      if (carreraResults.length === 0) return callback(new Error('No carreras found'));

      const idCarrera = carreraResults[0].id;
      const insertQuery = 'INSERT INTO alumno (documento, año_ingreso, id_carrera) VALUES (?, ?, ?)';

      connection.query(insertQuery, [documento, randomYear, idCarrera], (insertError) => {
        if (insertError) return callback(insertError);
        callback(null);
      });
    });
  });
}

function insertAdministrador(documento, callback) {
  const checkQuery = 'SELECT * FROM administrador WHERE documento = ?';
  connection.query(checkQuery, [documento], (checkError, checkResults) => {
    if (checkError) return callback(checkError);
    if (checkResults.length > 0) return callback(null); // Ya está insertado

    const insertQuery = 'INSERT INTO administrador (documento) VALUES (?)';
    connection.query(insertQuery, [documento], (insertError) => {
      if (insertError) return callback(insertError);
      callback(null);
    });
  });
}

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
    res.json(results);
  });
});



app.post('/predictions', (req, res) => {
  const { id_partido, prediccion_local, prediccion_visitante} = req.body;
  const documento_alumno = req.body.documento_alumno || req.headers['documento'] || null;
  // Validación de datos
  if (!documento_alumno || !id_partido || prediccion_local === undefined || prediccion_visitante === undefined) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
 
  // Verificar si ya existe una predicción para este partido por este alumno
  const checkPredictionQuery = `
    SELECT * FROM prediccion WHERE documento_alumno = ? AND id_partido = ?
  `;

  connection.query(checkPredictionQuery, [documento_alumno, id_partido], (error, results) => {
    if (error) {
      console.error('Error de base de datos al verificar la predicción:', error.sqlMessage);
      return res.status(500).json({ error: 'Error de base de datos al verificar la predicción', details: error.sqlMessage });
    }

    if (results.length > 0) {
      return res.status(400).json({ error:'Ya existe una predicción para este partido' });
    }

    const insertPredictionQuery = `
      INSERT INTO prediccion (documento_alumno, id_partido, prediccion_local, prediccion_visitante)
      VALUES (?, ?, ?, ?)
    `;

    // Inserta la predicción del partido
    connection.query(insertPredictionQuery, [documento_alumno, id_partido, prediccion_local, prediccion_visitante], (error, results) => {
      if (error) {
        console.error('Error de base de datos al guardar la predicción:', error.sqlMessage);
        return res.status(500).json({ error: 'Error de base de datos al guardar la predicción', details: error.sqlMessage });
      }

        res.status(200).json({ message: 'Predicción guardada con éxito' });

    });
  });
});




// Ruta para guardar predicción del campeonato
// Ruta para guardar predicción del campeonato
app.post('/championship-predictions', (req, res) => {
  const { documento_alumno, campeon, subcampeon } = req.body;
  console.log("POST TORNEO");
  
  // Validación de datos
  if (!documento_alumno || !campeon || !subcampeon) {
    return res.status(400).json({ error: 'Faltan campos obligatorios campeonato' });
  }

  // Verificar si ya existe una predicción de campeonato para este alumno
  const checkTournamentPredictionQuery = `
    SELECT * FROM prediccion_campeonato WHERE documento_alumno = ?
  `;
  
  connection.query(checkTournamentPredictionQuery, [documento_alumno], (error, results) => {
    if (error) {
      console.error('Error de base de datos al verificar la predicción del campeonato:', error.sqlMessage);
      return res.status(500).json({ error: 'Error de base de datos al verificar la predicción del campeonato', details: error.sqlMessage });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Ya existe una predicción de campeonato para este alumno' });
    }

    const insertPredictionChampionshipQuery = `
      INSERT INTO prediccion_campeonato (documento_alumno, campeon, subcampeon)
      VALUES (?, ?, ?)
    `;

    connection.query(insertPredictionChampionshipQuery, [documento_alumno, campeon, subcampeon], (error, results) => {
      if (error) {
        console.error('Error de base de datos al guardar la predicción del campeonato:', error.sqlMessage);
        return res.status(500).json({ error: 'Error de base de datos al guardar la predicción del campeonato', details: error.sqlMessage });
      }

      res.status(200).json({ message: 'Predicción de campeonato guardada con éxito' });
    });
  });
});





// Ruta para obtener predicciones por documento del alumno
app.get('/predictions/:documento', (req, res) => {
  const documento = req.params.documento;

  const query = `
    SELECT p.*, c.equipo_local, c.equipo_visitante 
    FROM prediccion p
    JOIN compite c ON p.id_partido = c.id
    WHERE p.documento_alumno = ?
  `;

  connection.query(query, [documento], (error, results) => {
    if (error) {
      console.error('Error executing query:', error.sqlMessage);
      return res.status(500).json({ error: 'Error de base de datos al obtener las predicciones', details: error.sqlMessage });
    }

    res.json(results);
  });
});


// Ruta para obtener la prediccion del torneo por documento del alumno
app.get('/tournament-prediction/:documento', (req, res) => {
  const documento = req.params.documento;
  const getTournamentPredictionQuery = `
    SELECT campeon, subcampeon
    FROM prediccion_campeonato
    WHERE documento_alumno = ?
  `;
  connection.query(getTournamentPredictionQuery, [documento], (error, results) => {
    if (error) {
      console.error('Error fetching tournament prediction:', error);
      return res.status(500).json({ error: 'Database error fetching tournament prediction' });
    }
    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ error: 'No tournament prediction found' });
    }
  });
});

// Ruta para eliminar una predicción
  app.delete('/predictions/:id_prediccion', (req, res) => {
    const id_prediccion = req.params.id_prediccion;

    const deletePredictionQuery = 'DELETE FROM prediccion WHERE id = ?'; 

    connection.query(deletePredictionQuery, [id_prediccion], (error, results) => {
      if (error) {
        console.error('Error deleting prediction:', error);
        return res.status(500).json({ error: 'Database error deleting prediction' });
      }

      res.status(200).json({ message: 'Prediction deleted successfully' });
    });
  });



  function obtenerHoraInicioPartido(id_partido) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT hora FROM compite WHERE id = ?';
      connection.query(query, [id_partido], (error, results) => {
        if (error) {
          return reject(error);
        }
        if (results.length > 0) {
          resolve(new Date(results[0].hora));
        } else {
          reject(new Error('Partido no encontrado'));
        }
      });
    });
  }  
  
  // Ruta para actualizar una predicción
  app.put('/predictions/:predictionId', async (req, res) => {
    const id_prediccion = req.params.predictionId; 
    const { documento_alumno, id_partido, prediccion_local, prediccion_visitante} = req.body; 
    
    try {
      const horaInicioPartido = await obtenerHoraInicioPartido(id_partido);
      const horaActual = new Date();
      const diferenciaHoras = (horaInicioPartido - horaActual) / (1000 * 60 * 60);
  
      if (diferenciaHoras < 1) {
        return res.status(400).json({ error: 'No se puede modificar la predicción porque el partido está a menos de una hora de comenzar.' });
      }
  
      const updatePredictionQuery = `
        UPDATE prediccion
        SET documento_alumno = ?, id_partido = ?, prediccion_local = ?, prediccion_visitante = ?
        WHERE id = ?
      `;
      connection.query(updatePredictionQuery, [documento_alumno, id_partido, prediccion_local, prediccion_visitante, id_prediccion], (error, results) => {
        if (error) {
          console.error('Error updating prediction:', error);
          return res.status(500).json({ error: 'Database error updating prediction' });
        }
        res.status(200).json({ success: true, message: 'Predicción actualizada correctamente', data: { id: id_prediccion, documento_alumno, id_partido, prediccion_local, prediccion_visitante } });
        });
        } catch (error) {
          console.error('Error:', error);
          res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
  
      });





// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
