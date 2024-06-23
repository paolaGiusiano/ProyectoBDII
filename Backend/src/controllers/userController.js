const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const { connection, queryPromise } = require('../../app');

const router = express.Router();



// Ruta para obtener información de un alumno específico
router.get('/alumnos/:documento', (req, res) => {
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
router.get('/administrador/:documento', (req, res) => {
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

// Ruta para eliminar un usuario
router.delete('/user/:documento', (req, res) => {
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

module.exports = router;