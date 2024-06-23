const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const { connection, queryPromise } = require('../../app');

const router = express.Router();



// Ruta para obtener todas las carreras
router.get('/carreras', (req, res) => {
    const query = 'SELECT * FROM carrerra';
  
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error fetching carreras:', error);
        return res.status(500).json({ error: 'Database error fetching carreras' });
      }
      res.status(200).json(results);
    });
  });
  
  // Ruta para obtener todas los equipos
router.get('/equipos', (req, res) => {
    const query = 'SELECT * FROM equipo';
  
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error fetching equipos:', error);
        return res.status(500).json({ error: 'Database error fetching equipos' });
      }
      res.status(200).json(results);
    });
  });


  // Ruta para obtener todos los partidos
router.get('/partidos', (req, res) => {
    const query = 'SELECT * FROM compite';
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error fetching matches:', error);
        return res.status(500).json({ error: 'Database error fetching matches' });
      }  
      res.status(200).json(results);
    });
  });

  
router.get('/matches/upcoming', (req, res) => {
    const query = 'SELECT * FROM compite  ORDER BY fecha, hora';
    
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).send('Internal Server Error');
      }
      res.json(results);
    });
  });
  

module.exports = router;