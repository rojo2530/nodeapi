'use strict';

const express = require('express');
const router = express.Router();
const loginController = require('../../controllers/loginController');

const { loginJWT } = loginController();

router.post('/', loginJWT);

module.exports = router;