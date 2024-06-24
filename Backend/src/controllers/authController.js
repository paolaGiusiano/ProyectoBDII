const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const { connection, queryPromise } = require('../../app');

const router = express.Router();




router.post('/register', async (req, res) => {
    const { nombre, apellido, documento, email, paisNacimiento, carrera, username, password, campeon, subcampeon } = req.body;
    
    if (!documento || !nombre || !apellido || !email || !paisNacimiento || !username || !password) {
      return res.status(400).json({ message: 'Todos los campos requeridos deben ser completados.' });
    }
  
    const currentYear = new Date().getFullYear();
    const anio_ingreso = Math.floor(Math.random() * 5) + (currentYear - 4);
  
    try {
      // Check if the user is an administrator
      const adminCheckQuery = 'SELECT documento FROM administrador WHERE documento = ?';
      connection.query(adminCheckQuery, [documento], async (error, results) => {
        if (error) {
          console.error('Error al buscar el administrador:', error);
          return res.status(500).json({ message: 'Error al registrar el usuario.' });
        }
  
        if (results.length > 0) {
          // User is an administrator, respond with error
          return res.status(400).json({ message: 'Solo se pueden registrar alumnos.' });
        }
  
        // Proceed with student registration
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
      });
    } catch (error) {
      console.error('Error al hashear la contraseña:', error);
      res.status(500).json({ message: 'Error al registrar el usuario.' });
    }
  });
  
  

  
  router.post('/login', (req, res) => {
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


  module.exports = router;