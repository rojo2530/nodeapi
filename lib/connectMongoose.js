'use strict';

//cargar libreria de Mongoose
const mongoose = require('mongoose');
const conn = mongoose.connection;

if (!process.env.MONGODB_URL) {
	console.error("Please set the MONGODB_URL environment variable");
	process.exit(1);
}

// gestionar eventos de la conexión
conn.on('error', err => {
    console.log('Error de conexión', err);
    process.exit(1);  //Nos salimos de la app
});

conn.once('open', () => {
    console.log('Conectado a MongoDB en ', conn.name);
});

//conectar
mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true});

module.exports = conn;