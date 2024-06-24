const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const { connection, queryPromise } = require('../../app');

const router = express.Router();


router.post('/matches/results', (req, res) => {
  const { id_partido, goles_local, goles_visitante, equipo_local, equipo_visitante } = req.body;

  console.log("APP MATCH ", req.body);

  const getTeamsQuery = 'SELECT equipo_local, equipo_visitante FROM compite WHERE id = ?';
  connection.query(getTeamsQuery, [id_partido], (error, results) => {
    if (error) {
      console.error('Error fetching current team names:', error);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length !== 1) {
      return res.status(404).send('Match not found');
    }

    let equipo_local_actual = results[0].equipo_local;
    let equipo_visitante_actual = results[0].equipo_visitante;

    console.log("APP2 MATCH ", req.body, equipo_local_actual, equipo_local);

    // Verificar y actualizar si los nombres son "Por definirse"
    if (equipo_local_actual === 'Por definirse') {
      equipo_local_actual = equipo_local; // Usar el nombre real enviado en la solicitud
    }

    if (equipo_visitante_actual === 'Por definirse') {
      equipo_visitante_actual = equipo_visitante; // Usar el nombre real enviado en la solicitud
    }

    console.log('Updated equipos:', equipo_local_actual, equipo_visitante_actual);

    const updateTeamsQuery =
      `UPDATE compite 
      SET 
          equipo_local = ?, 
          equipo_visitante = ? 
      WHERE id = ?`;

    connection.query(updateTeamsQuery, [equipo_local_actual, equipo_visitante_actual, id_partido], (error, updateResults) => {
      if (error) {
        console.error('Error updating team names:', error);
        return res.status(500).send('Internal Server Error');
      }

      // Insertar el resultado del partido en la tabla resultado
      const insertResultQuery =
        `INSERT INTO resultado (id_partido, goles_local, goles_visitante, fecha) 
        SELECT ?, ?, ?, fecha FROM compite WHERE id = ?`;

      connection.query(insertResultQuery, [id_partido, goles_local, goles_visitante, id_partido], (error, results) => {
        if (error) {
          console.error('Error inserting match result:', error);
          return res.status(500).send('Internal Server Error');
        }

        res.status(200).json({ success: true, message: 'Result saved successfully' });
      });
    });
  });
});

/*
router.post('/matches/results', (req, res) => {
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
  
 */
  
router.get('/matches/results', (req, res) => {
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



//obtener el resultado del partido final
router.get('/matches/results/final', (req, res) => {
  const finalMatchId = 42; // ID del partido final
  const query = `
    SELECT r.id_partido, r.goles_local, r.goles_visitante, r.fecha, c.equipo_local, c.equipo_visitante
    FROM resultado r
    JOIN compite c ON r.id_partido = c.id
    WHERE r.id_partido = ?
  `;
  connection.query(query, [finalMatchId], (error, results) => {
    if (error) {
      console.error('Error fetching final match result:', error);
      return res.status(500).send('Internal Server Error');
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Resultado del partido final no encontrado' });
    }
    
    const finalResult = results[0];
    let campeon, subcampeon;

    if (finalResult.goles_local > finalResult.goles_visitante) {
      campeon = finalResult.equipo_local;
      subcampeon = finalResult.equipo_visitante;
    } else {
      campeon = finalResult.equipo_visitante;
      subcampeon = finalResult.equipo_local;
    }
    
    console.log("RESULT CONTROLLER", { campeon, subcampeon });
    res.status(200).json({ campeon, subcampeon });
  });
});

  module.exports = router;