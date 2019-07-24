var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html'); //Se hace esto apra usar ficheros con extension html en vez de ejs, y asi vscode nos de ayuda de html
app.engine('html', require('ejs').__express);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/**
 * Conexion a la base de datos
 */
require('./lib/connectMongoose');
require('./models/Anuncio');

/**
 * Rutas para la API
 */
app.use('/apiv1/anuncios', require('./routes/apiv1/anuncios'));

 /**
  * Rutas para las vistas
  */

app.use('/',      require('./routes/index'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log('url: ',req.path);
  if (err.array) { //error de validacion
    err.status = 422;
    const errInfo = err.array({onlyFirstError: true})[0]; //Sacamos la propiedad cero.
    err.message = `Not valid - ${errInfo.param} ${errInfo.msg}`;
  }

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log(err);
  // render the error page
  if (req.path === '/apiv1/anuncios') {
    res.status(err.status || 500);
    res.json(err);
  }
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
