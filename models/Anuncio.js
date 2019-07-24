'use strict';

const mongoose = require('mongoose');

//definimos un esquema
const anuncioSchema = mongoose.Schema({
    name: String,
    venta: Boolean,
    precio: Number,
    foto: String,
    tags: [String]
});
// , collection:'agentes');  //para saltarse la pluralización

//Creamos el modelo de Agente

const Anuncio = mongoose.model('Anuncio', anuncioSchema);

module.exports = Anuncio;