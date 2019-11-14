'use strict';

const express = require('express');
const router = express.Router();
const localeController = require('../controllers/localeController');

const { changeLocale } = localeController();

router.get('/:locale', changeLocale);

module.exports = router;