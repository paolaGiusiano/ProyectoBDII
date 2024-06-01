// generateHash.js
const bcrypt = require('bcrypt');
const password = 'test123'; // Cambia esto por la contraseña que quieres hashear
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) throw err;
  console.log(hash); // Guarda este hash en tu base de datos
});
