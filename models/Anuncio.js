'use strict';

const mongoose = require('mongoose');

//definimos un esquema
const anuncioSchema = mongoose.Schema({
    nombre: String,
    venta: Boolean,
    precio: Number,
    foto: String,
    tags: [String]
});

//Creamos el modelo de Anuncio

const Anuncio = mongoose.model('Anuncio', anuncioSchema);

module.exports = Anuncio;