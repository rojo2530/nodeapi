'use strict';
const config = require('../lib/config');
const getPriceFilter = require('../lib/aux');
const Anuncio = require('../models/Anuncio');

const indexController = () => {
  return {
    index: async (req, res, next) => {
      try {
          //Valores por defecto
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
          res.render('index', { anuncios: anuncios});
          return;
      } catch (err) {
          next(err);
          return;
      }
    },
  }
}

module.exports = indexController;