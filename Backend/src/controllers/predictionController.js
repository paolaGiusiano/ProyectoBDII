const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const { connection, queryPromise } = require('../../app');

const router = express.Router();




router.post('/predictions', async (req, res) => {
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
      const fechaPartidoStartOfDay = new Date(fechaPartido.setHours(0, 0, 0, 0));
      const fechaActualStartOfDay = new Date(fechaActual.setHours(0, 0, 0, 0));
      
      // Verificar si ya pasó la fecha del partido
      if (fechaPartidoStartOfDay < fechaActualStartOfDay) {
        if (results.length > 0) {
          return res.status(400).json({ error: 'No se puede modificar la predicción' });
        } else {
          return res.status(400).json({ error: 'No se puede realizar la predicción' });
        }
      }
   
      // Verificar si ya pasó menos de 1 hora para el inicio del partido
      if (diferenciaHoras < 1 && (fechaActual) >= fechaPartido ) {
        if (results.length > 0) {
          return res.status(400).json({ error: 'No se puede modificar la predicción' });
        } else {
          return res.status(400).json({ error: 'No se puede realizar la predicción' });
        }
      }
   
      // Si ya existe una predicción, manejar el caso según tus requerimientos
      if (results.length > 0) {
          return res.status(400).json({ error: 'Ya existe una predicción para este partido ' });
      }
      // Insertar nueva predicción
      const insertPredictionQuery = 'INSERT INTO prediccion (documento_alumno, id_partido, prediccion_local, prediccion_visitante) VALUES (?, ?, ?, ?)';
      
      const [insertError] = await new Promise((resolve) => {
        connection.query(insertPredictionQuery, [documento_alumno, id_partido, prediccion_local, prediccion_visitante], (error, results) => {
          resolve([error, results]);
        });
      });

      if (insertError) {
          return res.status(500).json({ error: 'Error al guardar la predicción', details: insertError.sqlMessage });
      }

      return res.status(200).json({ message: 'Predicción guardada con éxito' });
  } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});


router.put('/predictions/:id', async (req, res) => {
  const { id_partido, prediccion_local, prediccion_visitante, documento_alumno } = req.body;

  if (!id_partido || prediccion_local === undefined || prediccion_visitante === undefined || !documento_alumno) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
 
  try {
   
      // Actualizar la predicción
      const updatePredictionQuery = 'UPDATE prediccion SET prediccion_local = ?, prediccion_visitante = ? WHERE documento_alumno = ? AND id_partido = ?';
        const [updateError] = await new Promise((resolve) => {
          connection.query(updatePredictionQuery, [prediccion_local, prediccion_visitante, documento_alumno, id_partido], (error, results) => {
            resolve([error, results]);
          });
      });

      if (updateError) {
          return res.status(500).json({ error: 'Error al actualizar la predicción', details: updateError.sqlMessage });
      }
     
      return res.status(200).json({ message: 'Predicción actualizada con éxito' });
  } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

  


// Ruta para obtener predicciones por documento del alumno
router.get('/predictions/:documento', (req, res) => {
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
  

  
// Ruta para obtener todas las predicciones
router.get('/predictions', (req, res) => {
    const query = `
      SELECT p.*, c.equipo_local, c.equipo_visitante 
      FROM prediccion p
      JOIN compite c ON p.id_partido = c.id
    `;
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error executing query:', error.sqlMessage);
        return res.status(500).json({ error: 'Error de base de datos al obtener todas las predicciones', details: error.sqlMessage });
      }
      res.json(results);
    });
});

// Ruta para obtener las predicciones del campeonato por documento del alumno
router.get('/tournament-prediction/:documento', (req, res) => {
  const documento = req.params.documento;

  const query = 'SELECT * FROM prediccion_campeonato WHERE documento_alumno = ?';
  connection.query(query, [documento], (error, results) => {
    if (error) {
      console.error('Error executing query:', error.sqlMessage);
      return res.status(500).json({ error: 'Error de base de datos al obtener las predicciones del campeonato', details: error.sqlMessage });
    }
  
    res.json(results);
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
    
function formatTime(time) {
    return time.substring(0, 5); 
}
  
module.exports = router;