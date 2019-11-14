'use strict';

const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

const { index, post } = loginController();

router.get('/', index);
router.post('/', post);

module.exports = router;