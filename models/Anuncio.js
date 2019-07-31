'use strict';

const mongoose = require('mongoose');

//definimos un esquema
const anuncioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    venta: {
        type: Boolean,
        required: true
    },
    precio: {
        type: Number,
        required: true,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value'
        },
        min:1
    },
    foto: {
        type: String,
        required: true  
    },
    tags:{
        type: [String],
        enum: ['work', 'mobile', 'lifestyle', 'motor'],
        validate: [(value) => value.length > 0, 'Tags can not be empty'],
    }
});

anuncioSchema.statics.list = function ({filter, start, limit, sort, fields}) {   //No usar aquí arrow functions, ya que este this es un this sintectico inyectoado por Moongoose
    const query = Anuncio.find(filter);
    query.skip((start - 1) * limit) ;   //Pasamos (start -1) * limit, porque skip representa en el número de documentos o registros que nos saltamos y start en la pagina que empezamos, por tanto skip = (start - 1) * limit
    query.limit(limit);
    query.select(fields);
    query.sort(sort);
    return query.exec();
}

//Creamos el modelo de Anuncio

const Anuncio = mongoose.model('Anuncio', anuncioSchema);

module.exports = Anuncio;