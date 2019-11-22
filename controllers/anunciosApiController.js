'use strict';

const Anuncio = require('../models/Anuncio');
const getPriceFilter = require('../lib/aux');
const config = require('../lib/config');
const createTask = require('../rabbitmq/publisher');

const anunciosApiController = () => {
  return {
    /**
     * GET apiv1/anuncios
     */
    index: async (req, res, next) => {
      try {
          const url = `http://${req.hostname}:${req.app.settings.port}/images/`;
          const start = typeof req.query.start === 'undefined' ? config.START : parseInt(req.query.start);
          const limit = typeof req.query.limit === 'undefined' ? config.LIMIT : parseInt(req.query.limit);
          const filter = {};
          const { tag, venta, nombre, sort, precio, fields } = req.query;
  
          //Si buscamos por nombre, no va a ser por nombre exacto sino que empiece por ese nombre, omitiendo mayúsculas
          if (nombre)  filter.nombre = new RegExp("^" + nombre, 'i');
          
          if (typeof venta !== 'undefined')  filter.venta = venta;
          
          if (tag) filter.tags = tag;
          
          if (typeof precio !== 'undefined')  filter.precio = getPriceFilter(precio);
          
          const anuncios = await Anuncio.list({filter: filter, start, limit, sort, fields});
          anuncios.forEach(anuncio => anuncio.foto = url + anuncio.foto);  //añadimos la url base de la foto
          res.json({sucess: true, results: anuncios});
          return;
      } catch (err) {
          next(err);
          return;
      }
    },
    /**
     * POST apiv1/anuncios
     */
    post: async (req, res, next) => {
      try {
          const data = req.body;
          const file = req.file;
          if (!file) {
            const error = new Error('Please upload a file')
            error.status = 400
            return next(error)
          }
          //Para evitar tags duplicados
          data.tags = [...new Set(data.tags)];
          data.foto = req.file.originalname;
          const anuncio = new Anuncio(data);
          const anuncioSaved = await anuncio.save();
          //mandar a rabbitmq
          res.json({ sucess: true, result: anuncioSaved });
          createTask({
            texto: 'Create thumbnail for  ' + data.foto + ' ' + Date.now(),
            imageName: data.foto,
            quality: 80
          }).catch(err => console.log(err));
      } catch (err) {
          next(err)
      }
    }
  }
}

module.exports = anunciosApiController;