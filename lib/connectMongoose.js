'use strict';

//cargar libreria de Mongoose
const mongoose = require('mongoose');
const conn = mongoose.connection;

// gestionar eventos de la conexión
conn.on('error', err => {
    console.log('Error de conexión', err);
    process.exit(1);  //Nos salimos de la app
});

conn.once('open', () => {
    console.log('Conectado a MongoDB en ', conn.name);
});

//conectar
mongoose.connect('mongodb://localhost/anunciosdb', {useNewUrlParser: true});

// exportamos la conexion (opcional)
module.exports = conn;