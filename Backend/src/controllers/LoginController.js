const bcrypt = require('bcrypt');

function index(req, res) {
  if (req.session.loggedin) {
    res.redirect('/');
  } else {
    res.render('login/index');
  }
}

function auth(req, res) {
  const data = req.body;
  const username = data.username;

  req.getConnection((err, conn) => {
    if (err) {
      return res.render('login/index', { error: 'Error de conexión a la base de datos' });
    }
    conn.query('SELECT * FROM users WHERE username = ?', [username], (err, userdata) => {
      if (err) {
        return res.render('login/index', { error: 'Error de consulta a la base de datos' });
      }
      if (userdata.length > 0) {
        bcrypt.compare(data.password, userdata[0].password, (err, isMatch) => {
          if (err) {
            return res.render('login/index', { error: 'Error de comparación de Bcrypt' });
          }
          if (!isMatch) {
            res.render('login/index', { error: 'Error: contraseña incorrecta' });
          } else {
            req.session.loggedin = true;
            req.session.name = userdata[0].name;
            res.redirect('/');
          }
        });
      } else {
        res.render('login/index', { error: 'Error: el usuario no existe' });
      }
    });
  });
}

function logout(req, res) {
  if (req.session.loggedin) {
    req.session.destroy();
  }
  res.redirect('/');
}

module.exports = {
  index: index,
  auth: auth,
  logout: logout,
};
