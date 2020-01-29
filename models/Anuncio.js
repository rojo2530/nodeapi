'use strict';

const mongoose = require('mongoose');

//definimos un esquema
const anuncioSchema = mongoose.Schema(
    {  
        /**
        * Nombre del articulo en compra/venta
        */
        name: { type: String, required: true, max: 30, index: true },
        /**
        * Descripcion del articulo en venta
        */
        description: { type: String, max: 100 },
        /**
        * Precio del artículo
        */
        price: { type: Number, required: true },
        /**
        * Tipo de anuncio: compra o venta
        */
        type: { type: String, enum: ['buy', 'sell'], required: true, index: true },
        /**
        * Foto del artículo
        */
        photo: { type: String, required: true },
        /**
        * Tags del anuncio
        */
        tags: [{ type: String, enum: ['work', 'lifestyle', 'motor', 'mobile'], index: true},]
        },
    {
        /**
        * Añade las propiedades de created y updated
        */
        timestamps: true,
    }    
);
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