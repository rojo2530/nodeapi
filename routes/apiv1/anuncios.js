'use strict';

const express = require('express');
const router = express.Router();
const Anuncio = require('../../models/Anuncio');



router.get('/', async (req, res, next) => {
    
    try {
        const anuncios = await Anuncio.find().exec();
        res.json({ sucess: true, anuncios: anuncios});
    } catch (err) {
        next(err);
        // return;
    }
});

module.exports = router;