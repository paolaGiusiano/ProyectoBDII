const bcrypt = require('bcrypt');
const mysql = require('mysql'); // Asegúrate de importar mysql si aún no lo has hecho

// Configura tu conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    port: 3306,
    database: 'pencaucu'
  });
  
// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos');
  
  // Función asincrónica para actualizar la contraseña del administrador
  async function updateAdminPassword() {
    try {
      // Generar hash de la nueva contraseña
      const hashedPassword = await bcrypt.hash('pepe123', 10);
  
      // Actualizar la contraseña en la base de datos
      const updateQuery = 'UPDATE login SET password = ? WHERE username = ?';
      connection.query(updateQuery, [hashedPassword, 'pepe.gomez'], (error, results) => {
        if (error) {
          console.error('Error al actualizar la contraseña del administrador:', error);
          throw error; // Lanzar el error para manejarlo en el catch
        }
        console.log('Contraseña del administrador actualizada correctamente');
        connection.end(); // Cerrar la conexión después de la operación
      });
    } catch (error) {
      console.error('Error en la función updateAdminPassword:', error);
    }
  }

  // Llamar a la función para actualizar la contraseña
  updateAdminPassword();
});
