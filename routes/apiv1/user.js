'use strict';

const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController')
const { forgotPassword, reset, updatePassword } = userController();

router.post('/forgotPassword', forgotPassword);
router.get('/reset', reset);
router.put('/updatePassword',updatePassword);
module.exports = router;