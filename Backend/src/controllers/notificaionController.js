const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const { connection, queryPromise } = require('../../app');
const nodemailer = require('nodemailer');

const router = express.Router();

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
  
 router.post('/enviarCorreoAntesPartido', (req, res) => {
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

module.exports = router;