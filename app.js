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
app.use('/apiv1/tags', require('./routes/apiv1/tags'));


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
  // comprobar error de validación que hemos hecho con el middleware express-validator
  if (err.array) { //error de validacion
    err.status = 422;
    const errInfo = err.array({onlyFirstError: true})[0]; //Sacamos la propiedad cero.
    err.message = isApi(req) ? 
        { message: 'Not valid', errors: err.mapped()}:
        `Not valid - ${errInfo.param} ${errInfo.msg}`;
  }
  res.status(err.status || 500);


  if (isApi(req)) {
    res.json({ sucesss: false, error: err.message});
    return;   
  }
  
   // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page

  res.render('error');
});

function isApi(req) {
  return req.originalUrl.indexOf('/apiv') === 0;
}

module.exports = app;
