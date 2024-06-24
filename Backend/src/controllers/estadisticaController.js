const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const { connection, queryPromise } = require('../../app');

const router = express.Router();



// Ruta para obtener estadísticas
router.get('/estadisticas', (req, res) => {
    const query = `
      SELECT a.documento, u.nombre, u.apellido, a.id_carrera, pt.puntaje_total AS aciertos_totales
      FROM alumno a
      JOIN usuario u ON a.documento = u.documento
      JOIN carrerra c ON a.id_carrera = c.id
      JOIN PuntajeTotal pt ON a.documento = pt.documento_alumno;
    `;
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error fetching statistics:', error);
        return res.status(500).json({ error: 'Database error fetching statistics' });
      }
      res.status(200).json(results);
    });
});

module.exports = router;