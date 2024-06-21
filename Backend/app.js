const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
const port = 3000;
const router = express.Router();
const nodemailer = require('nodemailer');


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

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      user: 'paola.giusiano@correo.ucu.edu.uy',
      pass: 'tu-contraseña'
  }
});

function enviarCorreo(destinatarios, asunto, mensaje) {
  const mailOptions = {
      from: 'tu-usuario@correo.ucu.edu.uy', // Tu dirección de correo UCU
      to: destinatarios.join(','),
      subject: asunto,
      text: mensaje
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error('Error sending email:', error);
      } else {
          console.log('Email sent: ' + info.response);
      }
  });
}

function obtenerPartidosProximosYEnviarCorreos() {
  const queryPartidos = `
      SELECT * FROM compite
      WHERE TIMESTAMP(fecha, hora) = TIMESTAMP(DATE_ADD(NOW(), INTERVAL 2 HOUR));
  `;

  const queryAlumnos = `
      SELECT u.email 
      FROM alumno a
      JOIN usuario u ON a.documento = u.documento;
  `;

  connection.query(queryPartidos, (errorPartidos, resultadosPartidos) => {
      if (errorPartidos) {
          console.error('Error fetching matches: ', errorPartidos);
          return;
      }

      connection.query(queryAlumnos, (errorAlumnos, resultadosAlumnos) => {
          if (errorAlumnos) {
              console.error('Error fetching students: ', errorAlumnos);
              return;
          }

          const correosAlumnos = resultadosAlumnos.map(alumno => alumno.email);
          resultadosPartidos.forEach(partido => {
              const mensaje = `Recordatorio: El partido entre ${partido.equipo_local} y ${partido.equipo_visitante} comenzará en dos horas.`;
              enviarCorreo(correosAlumnos, 'Recordatorio de Partido', mensaje);
          });
      });
  });
}

// Llamar a la función obtenerPartidosProximosYEnviarCorreos periódicamente cada hora
setInterval(obtenerPartidosProximosYEnviarCorreos, 3600000); // 3600000 ms = 1 hora

app.post('/enviarCorreoAntesPartido', (req, res) => {
  const partido = req.body;

  const queryAlumnos = `
      SELECT u.email 
      FROM alumno a
      JOIN usuario u ON a.documento = u.documento;
  `;

  connection.query(queryAlumnos, (errorAlumnos, resultadosAlumnos) => {
      if (errorAlumnos) {
          console.error('Error fetching students: ', errorAlumnos);
          return res.status(500).send('Error fetching students');
      }

      const correosAlumnos = resultadosAlumnos.map(alumno => alumno.email);
      const mensaje = `Recordatorio: El partido entre ${partido.equipo_local} y ${partido.equipo_visitante} comenzará en dos horas.`;

      enviarCorreo(correosAlumnos, 'Recordatorio de Partido', mensaje);
      res.send('Correos enviados correctamente.');
  });
});



app.post('/register', async (req, res) => {
  const { nombre, apellido, documento, email, paisNacimiento, carrera, username, password, campeon, subcampeon } = req.body;
  
  if (!documento || !nombre || !apellido || !email || !paisNacimiento || !username || !password) {
    return res.status(400).json({ message: 'Todos los campos requeridos deben ser completados.' });
  }
  
  const currentYear = new Date().getFullYear();
  const anio_ingreso = Math.floor(Math.random() * 5) + (currentYear - 4);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const queryCarrera = 'SELECT id FROM carrerra WHERE id = ?';
    connection.query(queryCarrera, [carrera], (error, results) => {
      if (error) {
        console.error('Error al buscar la carrera:', error);
        return res.status(500).json({ message: 'Error al registrar el usuario.' });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: 'La carrera proporcionada no existe.' });
      }

      const id_carrera = results[0].id;

      connection.beginTransaction(async (err) => {
        if (err) {
          console.error('Error al iniciar la transacción:', err);
          return res.status(500).json({ message: 'Error al registrar el usuario.' });
        }

        try {
          // Verificar si el usuario ya existe en la tabla usuario
          const userCheckQuery = 'SELECT documento FROM usuario WHERE documento = ?';
          const userCheckResult = await queryPromise(userCheckQuery, [documento]);

          if (userCheckResult.length === 0) {
            // Insertar en la tabla usuario si el usuario no existe
            const userQuery = 'INSERT INTO usuario (documento, nombre, apellido, pais_nacimiento, email) VALUES (?, ?, ?, ?, ?)';
            await queryPromise(userQuery, [documento, nombre, apellido, paisNacimiento, email]);

            // Insertar en la tabla login
            const loginQuery = 'INSERT INTO login (username, password, documento_usuario) VALUES (?, ?, ?)';
            await queryPromise(loginQuery, [username, hashedPassword, documento]);
          }

          // Verificar si el alumno ya existe en la tabla alumno
          const studentCheckQuery = 'SELECT documento FROM alumno WHERE documento = ?';
          const studentCheckResult = await queryPromise(studentCheckQuery, [documento]);
         
          if (studentCheckResult.length === 0) {
            // Insertar en la tabla alumno si el alumno no existe
            const studentQuery = 'INSERT INTO alumno (documento, anio_ingreso, id_carrera) VALUES (?, ?, ?)';
            await queryPromise(studentQuery, [documento, anio_ingreso, id_carrera]);
          }
          
          // Insertar en la tabla prediccion_campeonato
          const predictionQuery = 'INSERT INTO prediccion_campeonato (documento_alumno, campeon, subcampeon) VALUES (?, ?, ?)';
          await queryPromise(predictionQuery, [documento, campeon, subcampeon]);
          console.log("APP2 ",documento);
          connection.commit((err) => {
            if (err) {
              console.error('Error al hacer commit de la transacción:', err);
              return connection.rollback(() => {
                res.status(500).json({ message: 'Error al registrar el usuario.' });
              });
            }
            res.status(201).json({ message: 'Usuario registrado exitosamente.' });
          });
        } catch (error) {
          console.error('Error durante la transacción:', error);
          connection.rollback(() => {
            res.status(500).json({ message: 'Error al registrar el usuario.' });
          });
        }
      });
    });
  } catch (error) {
    console.error('Error al hashear la contraseña:', error);
    res.status(500).json({ message: 'Error al registrar el usuario.' });
  }
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



app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = `
    SELECT l.password, u.documento
    FROM login l 
    JOIN usuario u ON l.documento_usuario = u.documento 
    WHERE l.username = ?`;
    
  connection.query(query, [username], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length > 0) {
      const hashedPassword = results[0].password;
      const documento = results[0].documento;

      bcrypt.compare(password, hashedPassword, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ error: 'Error comparing passwords' });
        }
        if (isMatch) {      
          res.status(200).json({ message: 'Login successful', documento: documento });
        } else {
          res.status(401).json({ message: 'Invalid username or password' });
        }
      });
    } else {
      res.status(401).json({ message: 'Usted no está registrado en la pencaUCU' });
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



app.get('/matches/upcoming', (req, res) => {
  const query = 'SELECT * FROM compite  ORDER BY fecha, hora';
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).send('Internal Server Error');
    }
    res.json(results);
  });
});

app.get('/matches/past', (req, res) => {
  const query = 'SELECT * FROM compite WHERE fecha < CURDATE() ORDER BY fecha, hora';
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).send('Internal Server Error');
    }
    res.json(results);
  });
});


/*
// Obtener los próximos partidos
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
*/

app.post('/matches/results', (req, res) => {
  const { id_partido, goles_local, goles_visitante } = req.body;
  const query = 'INSERT INTO resultado (id_partido, goles_local, goles_visitante, fecha) SELECT ?, ?, ?, fecha FROM compite WHERE id = ?';
  connection.query(query, [id_partido, goles_local, goles_visitante, id_partido], (error, results) => {
    if (error) {  
      console.error('Error executing query:', error);
      return res.status(500).send('Internal Server Error');
    } 
    res.status(200).json({ success: true, message: 'Result saved successfully' })
  });
});


app.get('/matches/results', (req, res) => {
  const query = `
    SELECT r.id_partido, r.goles_local, r.goles_visitante, r.fecha, c.equipo_local, c.equipo_visitante
    FROM resultado r
    JOIN compite c ON r.id_partido = c.id
  `;
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching results:', error);
      return res.status(500).send('Internal Server Error');
    }
    res.status(200).json(results);
  });
});


app.post('/predictions', async (req, res) => {
  const { id_partido, prediccion_local, prediccion_visitante } = req.body;
  const documento_alumno = req.body.documento_alumno || req.headers['documento'] || null;

  if (!documento_alumno || !id_partido || prediccion_local === undefined || prediccion_visitante === undefined) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    // Verificar si ya existe una predicción para este partido por este alumno
    const checkPredictionQuery = 'SELECT * FROM prediccion WHERE documento_alumno = ? AND id_partido = ?';
    const [error, results] = await new Promise((resolve) => {
      connection.query(checkPredictionQuery, [documento_alumno, id_partido], (error, results) => {
        resolve([error, results]);
      });
    });
    const horaInicioPartido = await obtenerHoraInicioPartido(id_partido);
    const horaActual = new Date();
    const diferenciaHoras = (horaInicioPartido - horaActual) / (1000 * 60 * 60);

    // Obtener la fecha del partido para comparar con la fecha actual
    const fechaPartido = await obtenerFechaPartido(id_partido);
    const fechaActual = new Date();

    // Verificar si ya pasó la fecha del partido
    if (formatDate(fechaPartido) < formatDate(fechaActual)) {
      if (results.length > 0) {
        return res.status(400).json({ error: 'No se puede modificar la predicción' });
      } else {
        return res.status(400).json({ error: 'No se puede realizar la predicción' });
      }
    }

    // Verificar si ya pasó menos de 1 hora para el inicio del partido
    if (diferenciaHoras < 1) {
      if (results.length > 0) {
        return res.status(400).json({ error: 'No se puede modificar la predicción' });
      } else {
        return res.status(400).json({ error: 'No se puede realizar la predicción' });
      }
    }


    
    if (error) {
      console.error('Error de base de datos al verificar la predicción:', error.sqlMessage);
      return res.status(500).json({ error: 'Error de base de datos al verificar la predicción', details: error.sqlMessage });
    }

    if (results.length > 0) {
      // Si existe una predicción, actualizarla si es posible
      const updatePredictionQuery = 'UPDATE prediccion SET prediccion_local = ?, prediccion_visitante = ? WHERE documento_alumno = ? AND id_partido = ?';
      const [updateError] = await new Promise((resolve) => {
        connection.query(updatePredictionQuery, [prediccion_local, prediccion_visitante, documento_alumno, id_partido], (error, results) => {
          resolve([error, results]);
        });
      });

      if (updateError) {
        console.error('Error al actualizar la predicción:', updateError.sqlMessage);
        return res.status(500).json({ error: 'Error al actualizar la predicción', details: updateError.sqlMessage });
      }

      return res.status(200).json({ message: 'Predicción actualizada con éxito' });
    } else {
      // Si no existe una predicción, insertar una nueva
      const insertPredictionQuery = 'INSERT INTO prediccion (documento_alumno, id_partido, prediccion_local, prediccion_visitante) VALUES (?, ?, ?, ?)';
      const [insertError] = await new Promise((resolve) => {
        connection.query(insertPredictionQuery, [documento_alumno, id_partido, prediccion_local, prediccion_visitante], (error, results) => {
          resolve([error, results]);
        });
      });

      if (insertError) {
        console.error('Error al guardar la predicción:', insertError.sqlMessage);
        return res.status(500).json({ error: 'Error al guardar la predicción', details: insertError.sqlMessage });
      }

      return res.status(200).json({ message: 'Predicción guardada con éxito' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});


function formatDate(dateString) {
  const date = new Date(dateString);
  const day = ('0' + date.getDate()).slice(-2);
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  return `${day}/${month}`;
}

async function obtenerFechaPartido(id_partido) {
  const query = 'SELECT fecha FROM compite WHERE id = ?';
  return new Promise((resolve, reject) => {
    connection.query(query, [id_partido], (error, results) => {
      if (error) {
        reject(error);
      } else {
        if (results.length > 0) {
          resolve(new Date(results[0].fecha));
        } else {
          reject(new Error(`No se encontró ningún partido con id_partido = ${id_partido}`));
        }
      }
    });
  });
}



// Ruta para guardar predicción del campeonato
app.post('/championship-predictions', (req, res) => {
  const { documento_alumno, campeon, subcampeon } = req.body;

  
  if (!documento_alumno || !campeon || !subcampeon) {
    return res.status(400).json({ error: 'Faltan campos obligatorios campeonato' });
  }


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


 // Ruta para obtener información de un alumno específico
 app.get('/alumnos/:documento', (req, res) => {
  const documento = req.params.documento;
  const query = `
    SELECT a.documento, a.anio_ingreso, a.id_carrera, u.nombre, c.nombre AS carrerra
    FROM alumno a
    JOIN usuario u ON a.documento = u.documento
    JOIN carrerra c ON a.id_carrera = c.id
    WHERE a.documento = ?`;

  connection.query(query, [documento], (error, results) => {
    if (error) {
      console.error('Error fetching alumno:', error);
      return res.status(500).json({ error: 'Database error fetching alumno' });
    }
    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ error: 'Alumno not found' });
    }
  });
});



 // Ruta para obtener información de un admin específico
 app.get('/administrador/:documento', (req, res) => {
  const documento = req.params.documento;
  const query = `
    SELECT a.documento, u.nombre
    FROM administrador a
    JOIN usuario u ON a.documento = u.documento
    WHERE a.documento = ?`;
   
  connection.query(query, [documento], (error, results) => {
    if (error) {
      console.error('Error fetching admin:', error);
      return res.status(500).json({ error: 'Database error fetching aadmin' });
    }
    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ error: 'Admin not found' });
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
        const hora = results[0].hora;
        const formattedTime = formatTime(hora); // HH:MM
        const today = new Date(); // Fecha actual
        const year = today.getFullYear();
        const month = today.getMonth();
        const day = today.getDate();
        const hours = parseInt(formattedTime.substring(0, 2)); // Obtener las horas
        const minutes = parseInt(formattedTime.substring(3, 5)); // Obtener los minutos
        const parsedDate = new Date(year, month, day, hours, minutes, 0); // Construir la fecha completa

        if (isNaN(parsedDate.getTime())) {
          return reject(new Error('Hora del partido no válida'));
        }
        resolve(parsedDate);
      } else {
        reject(new Error('Partido no encontrado'));
      }
    });
  });
}

  
  function formatTime(time) {
    return time.substring(0, 5); 
  }


  function obtenerFechaHoraInicioPartido(id_partido) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT fecha, hora FROM compite WHERE id = ?';
      connection.query(query, [id_partido], (error, results) => {
        if (error) {
          return reject(error);
        }
        if (results.length > 0) {
          const fecha = results[0].fecha;
          const hora = results[0].hora;
          const formattedTime = formatTime(hora); // HH:MM
          const [year, month, day] = fecha.split('-').map(Number); // Parsear la fecha en año, mes y día
          const [hours, minutes] = formattedTime.split(':').map(Number); // Parsear la hora en horas y minutos
          const parsedDate = new Date(year, month - 1, day, hours, minutes, 0); // Construir la fecha completa
  
          if (isNaN(parsedDate.getTime())) {
            return reject(new Error('Fecha y hora del partido no válidas'));
          }
          resolve(parsedDate);
        } else {
          reject(new Error('Partido no encontrado'));
        }
      });
    });
  }
  
  
  
// Ruta para obtener todos los partidos
app.get('/partidos', (req, res) => {
  const query = 'SELECT * FROM compite';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching matches:', error);
      return res.status(500).json({ error: 'Database error fetching matches' });
    }  
    res.status(200).json(results);
  });
});
     

// Ruta para obtener todos los puntajes totales con ranking
app.get('/puntajes-totales', (req, res) => {
  const query = `
    SELECT @rownum := @rownum + 1 AS puesto, p.documento_alumno, u.nombre, u.apellido, p.puntaje_total, c.nombre AS carrerra
    FROM (SELECT @rownum := 0) r, PuntajeTotal p
    JOIN alumno a ON p.documento_alumno = a.documento
    JOIN usuario u ON a.documento = u.documento
    JOIN carrerra c ON a.id_carrera = c.id
    ORDER BY p.puntaje_total DESC
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching puntajes totales:', error);
      return res.status(500).json({ error: 'Database error fetching puntajes totales' });
    }
    res.status(200).json(results);
  });
});



// Ruta para actualizar o insertar un puntaje total
app.put('/puntajes-totales/:documento_alumno', (req, res) => {
  const documentoAlumno = req.params.documento_alumno;
  const { puntaje_total } = req.body;

  const upsertQuery = `
    INSERT INTO PuntajeTotal (documento_alumno, puntaje_total)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE puntaje_total = VALUES(puntaje_total)
  `;
  
  connection.query(upsertQuery, [documentoAlumno, puntaje_total], (upsertError, upsertResults) => {
    if (upsertError) {
      console.error('Error upserting puntaje total:', upsertError);
      return res.status(500).json({ error: 'Database error upserting puntaje total' });
    }
    res.status(201).json({ message: 'Puntaje total upserted successfully' });
  });
});


// Ruta para obtener todas las carreras
app.get('/carreras', (req, res) => {
  const query = 'SELECT * FROM carrerra';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching carreras:', error);
      return res.status(500).json({ error: 'Database error fetching carreras' });
    }
    res.status(200).json(results);
  });
});

// Ruta para obtener todas las carreras
app.get('/equipos', (req, res) => {
  const query = 'SELECT * FROM equipo';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching equipos:', error);
      return res.status(500).json({ error: 'Database error fetching equipos' });
    }
    res.status(200).json(results);
  });
});


// Ruta para obtener estadísticas
app.get('/estadisticas', (req, res) => {
  const query = `
    SELECT a.documento, u.nombre, u.apellido, c.nombre AS carrera, pt.puntaje_total
    FROM alumno a
    JOIN usuario u ON a.documento = u.documento
    JOIN carrerra c ON a.id_carrera = c.id
    JOIN PuntajeTotal pt ON a.documento = pt.documento_alumno;
  `;
  console.log("APP ");
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching statistics:', error);
      return res.status(500).json({ error: 'Database error fetching statistics' });
    }
    res.status(200).json(results);
  });
});


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
