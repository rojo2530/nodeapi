'use strict';

const conn = require('./connectMongoose');
const Anuncio = require('../models/Anuncio');
const anuncios = require('../anuncios.json');

// gestionar eventos de la conexión

conn.once('open', async () => {
    try {
       const result =  await Anuncio.deleteMany({}).exec();
       console.log('Se han borrado ' + result.deletedCount + ' registros');
       const reg = await Anuncio.insertMany(anuncios);
       console.log('Se han creado ' + reg.length + ' registros');

    } catch(err) {
       console.log('Ha ocurrido un error ', err);
    }

    finally {
        conn.close();
        process.exit(0);
    }
});
