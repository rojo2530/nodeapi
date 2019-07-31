'use strict';

const express = require('express');
const router = express.Router();
const Anuncio = require('../../models/Anuncio');
const { query,validationResult} = require('express-validator');
const config = require('../../lib/config');

const tags = ["work", "lifestyle", "motor", "mobile"];

router.get('/',
    query('venta').optional().isBoolean().withMessage('must be a boleean value'),
    query('tag').optional().isIn(tags).withMessage('is not valid, only ' + tags.join(',')),
    query('nombre').optional().isAlphanumeric().withMessage('is not valid'),
    query('start').optional().isInt({gt: 0}).withMessage('start must be a positive number'),
    query('limit').optional().isInt({gt: 0}).withMessage('must be a positive number'),
    query('precio').optional().matches('(^[0-9]+-[0-9]*$)|(^-?[0-9]+$)').withMessage('is not valid'),

    (req, res, next) => {
        validationResult(req).throw();
        next();
    });

router.get('/', async (req, res, next) => {
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
});

router.post('/', async (req, res, next) => {
    try {
        const data = req.body;
        //Para evitar tags duplicados
        data.tags = [...new Set(data.tags)];
        const anuncio = new Anuncio(data);
        const anuncioSaved = await anuncio.save();
        res.json({ sucess: true, result: anuncioSaved });
    } catch (err) {
        next(err)
    }
});

function getPriceFilter(price) {
    //Si no incluye el guión buscamos por precio exacto
    if (!price.includes('-')) {
        return parseInt(price);
    }
    //Si comienza por un guión buscamos los articulos menores a ese precio
    if (price[0] === '-') {
        const priceNumber = parseInt(price.slice(1));
        return { '$lte': priceNumber };
    }
    //Si termina por un guión buscamos los artículos mayores a ese precio
    if (price[price.length - 1] === '-') {
        const priceNumber = parseInt(price.slice(0));
        return { '$gte': priceNumber };
    }

    const prices = price.split('-');
    return { '$gte': prices[0], '$lte': prices[1] };
}

module.exports = router;