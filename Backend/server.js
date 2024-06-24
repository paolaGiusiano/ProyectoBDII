const { app } = require('./app');
const authRouter = require('./src/controllers/authController');
const predictionRouter = require('./src/controllers/predictionController');
const matchRouter = require('./src/controllers/matchController');
const userRouter = require('./src/controllers/userController');
const statisticsRouter = require('./src/controllers/estadisticaController');
const scoreRouter = require('./src/controllers/scoreController');
const resultRouter = require('./src/controllers/resultController');
const notiRouter = require('./src/controllers/notificaionController');


// Definir las rutas
app.use('/auth', authRouter);
app.use('/prediction', predictionRouter);
app.use('/match', matchRouter);
app.use('/user', userRouter);
app.use('/statistics', statisticsRouter);
app.use('/score', scoreRouter);
app.use('/result', resultRouter);

// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

