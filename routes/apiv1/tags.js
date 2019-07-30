'use strict';

const express = require('express');
const router = express.Router();
const Anuncio = require('../../models/Anuncio');

router.get('/', async (req, res, next) => {
    try {
        const tags = await Anuncio.find().distinct('tags').exec();
        res.json({ sucess: true, results: tags});
        return;

    } catch (err) {
        next(err);
        return;
    }

});

module.exports = router;