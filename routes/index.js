var express = require('express');
var router = express.Router();
const {query, validationResult, checkSchema} = require('express-validator');

/* GET home page. */

const tags = ["work", "lifestyle", "motor", "mobile"];
const queryParametersValid = ["tag", "venta", "nombre", "precio", "start", "limit", "precio"];



//check if tag is valid
router.get('/', (req, res, next) => {
  // const {tag, venta, nombre, precio, start, limit, sort} = request.query;
  const tag = req.query.tag;

  if (!tags.includes(tag) && tag) {
    res.status(422);
    next({status:422, message:'Tag value query doesnt exists'})
    // return;
  }
    next();
});

router.get('/',query('venta').optional().isBoolean().withMessage('must be a boleean value') ,
  (req,res,next) => {
    validationResult(req).throw(); 
    next();
});




router.get('/', function(req, res, next) {
  
  res.render('index', { title: 'Express' });
});

module.exports = router;
