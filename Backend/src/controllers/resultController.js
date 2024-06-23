const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const { connection, queryPromise } = require('../../app');

const router = express.Router();




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

  module.exports = router;