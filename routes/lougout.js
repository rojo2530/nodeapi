'use strict';

const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

const { logout } = loginController();

router.get('/', logout);

module.exports = router;