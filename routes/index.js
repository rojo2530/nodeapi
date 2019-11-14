'use strict';

const express = require('express');
const router = express.Router();
const { query,validationResult} = require('express-validator');
const indexController = require('../controllers/indexController');
const sessionAuth = require('../lib/sessionAuth');

const { index } = indexController();

const tags = ["work", "lifestyle", "motor", "mobile"];

router.get('/',
    query('venta').optional().isBoolean().withMessage('must be a boleean value'),
    query('tag').optional().isIn(tags).withMessage('is not valid, only ' + tags.join(',')),
    query('nombre').optional().isAlphanumeric().withMessage('is not valid'),
    query('start').optional().isInt({gte: 0}).withMessage('must be a positive number'),
    query('limit').optional().isInt({gt: 0}).withMessage('must be a positive number'),
    query('precio').optional().matches('(^[0-9]+-[0-9]*$)|(^-?[0-9]+$)').withMessage('is not valid'),

    (req, res, next) => {
        validationResult(req).throw();
        next();
    });

router.get('/', sessionAuth, index);

module.exports = router;