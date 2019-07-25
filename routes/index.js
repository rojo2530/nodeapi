var express = require('express');
var router = express.Router();
const {query, validationResult} = require('express-validator');
const Anuncio = require('../models/Anuncio');
const isEmpty = require('../lib/utils');

/* GET home page. */

const tags = ["work", "lifestyle", "motor", "mobile"];
const queryParametersValid = ["tag", "venta", "nombre", "precio", "start", "limit", "precio"];

router.get('/',
  query('venta').optional().isBoolean().withMessage('must be a boleean value') ,
  query('tag').optional().isIn(["work", "lifestyle", "motor", "mobile"]).withMessage('is not valid'),
  query('nombre').optional().isAlphanumeric().withMessage('is not valid'),
  query('start').optional().isInt({gt: 0}).withMessage('must be a positive number'),
  query('limit').optional().isInt({gt: 0}).withMessage('must be a positive number'),
  query('precio').optional().matches('(^[0-9]+-[0-9]*$)|(^-?[0-9]+$)').withMessage('is not valid'),


    (req,res,next) => {
      validationResult(req).throw(); 
      next();
});


router.get('/', async (req, res, next) => {
  const query = {};
  const {tag, venta, nombre, precio, start, limit, sort} = req.query;
  
  // if (isEmpty(req.query)) {
  //   try {
  //       const anuncios = await Anuncio.find().exec();
  //       return;
  //   } catch (err) {
  //       next(err);
  //       return;
  //   }
  // }

  // query.tags = (typeof tag === 'undefined') ? undefined: tag;
  if (tag) query.tags = tag;
  if (venta) query.venta = venta;
  

  console.log(query);

//Si buscamos por nombre, no va a ser por nombre exacto sino que empiece por ese nombre, omitiendo mayúsculas
  if (nombre) {
      const regexNombre = new RegExp("^" + nombre, 'i');
      query.nombre = regexNombre;
  }

  

  try {
      console.log('Entra tags');
      const anuncios = await Anuncio.find(query).sort(sort).exec();
      res.render('index', { anuncios: anuncios});
      return;
  } catch (err) {
      next(err);
      return;
  }

});

module.exports = router;
