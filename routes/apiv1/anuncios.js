'use strict';

const express = require('express');
const router = express.Router();
const Anuncio = require('../../models/Anuncio');
const isEmpty = require('../../lib/utils');
const {query, validationResult, checkSchema} = require('express-validator');


// const queryParametersValid = ["tag", "venta", "nombre", "precio", "start", "limit", "sort"];


// const query = {
//     tag: '',
//     venta: '',
//     nombre: '',
//     precio: '',
//     start: 1,
//     limit: 0,
//     sort: 'nombre'    
// };

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

    

    //Si no hay querystring, nos traemos todos los registros 
    if (isEmpty(req.query)) {
        console.log('Entra todos');
        try {
            const anuncios = await Anuncio.find().sort().exec();
            res.json({ sucess: true, anuncios: anuncios});
            return;
        } catch (err) {

            next(err);
            return;
        }
    }

    if (tag) {
        query.tags = tag;
    }

    if (venta) {
        query.venta = venta;
    }
    //Si buscamos por nombre, no va a ser por nombre exacto sino que empiece por ese nombre, omitiendo mayúsculas
    if (nombre) {
        const regexNombre = new RegExp("^" + nombre, 'i');
        query.nombre = regexNombre;
    }


    console.log(query.sort);

    try {
        console.log('Entra tags');
        const anuncios = await Anuncio.find(query).sort(sort).exec();
        res.json({ sucess: true, anuncios: anuncios});
        return;
    } catch (err) {
        next(err);
        return;
    }

});

module.exports = router;