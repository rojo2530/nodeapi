'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { query,validationResult} = require('express-validator');
const path = require('path');
const anunciosApiController = require('../../controllers/anunciosApiController');


const { index, post } = anunciosApiController();

const tags = ["work", "lifestyle", "motor", "mobile"];

// SET STORAGE
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
			cb(null, path.join(__dirname, '..', '..', 'public', 'images'));
	},
	filename: function (req, file, cb) {
			cb(null, file.originalname);
	}
})

const upload = multer({ storage: storage });



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

router.get('/', index);

router.post('/', upload.single('foto'), post);

module.exports = router;