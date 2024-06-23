const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const { connection, queryPromise } = require('../../app');

const router = express.Router();



// Ruta para obtener todos los puntajes totales con ranking
router.get('/puntajes-totales', (req, res) => {
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
router.put('/puntajes-totales/:documento_alumno', (req, res) => {
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
  

module.exports = router;