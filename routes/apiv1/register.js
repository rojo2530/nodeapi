'use strict';

const express = require('express');
const router = express.Router();
const registerController = require('../../controllers/registerController');

const { index } = registerController();

router.post('/', index);

module.exports = router;