var express = require('express');
var router = express.Router();
const {query, validationResult, checkSchema} = require('express-validator');

/* GET home page. */

const tags = ["work", "lifestyle", "motor", "mobile"];
const queryParametersValid = ["tag", "venta", "nombre", "precio", "start", "limit", "precio"];



//check if tag is valid
// router.get('/', (req, res, next) => {
//   // const {tag, venta, nombre, precio, start, limit, sort} = request.query;
//   const tag = req.query.tag;

//   if (!tags.includes(tag) && tag) {
//     res.status(422);
//     next({status:422, message:'Tag value query doesnt exists'})
//     // return;
//   }
//     next();
// });

//check if venta is boleean
router.get('/',
  query('venta').optional().isBoolean().withMessage('must be a boleean value') ,
  query('tag').optional().isIn(["work", "lifestyle", "motor", "mobile"]).withMessage('is not valid'),
  query('nombre').optional().isAlphanumeric().withMessage('is not valid'),
  query('start').optional().isInt({gt: 0}).withMessage('must be a positive number'),
  query('limit').optional().isInt({gt: 0}).withMessage('must be a positive number'),
  query('precio').optional().matches('(^[0-9]+-[0-9]*$)|(^-?[0-9]+$)').withMessage('is not valid'),


    (req,res,next) => {
      validationResult(req).throw(); 
      next();
});

// router.get('/prueba', checkSchema({
//   tag: {
//     // The location of the field, can be one or more of body, cookies, headers, params or query.
//     // If omitted, all request locations will be checked
//     in: ['work', 'lifestyle', 'motor', 'mobile'],
//     errorMessage: 'tag is wrong',
//     },

//   }), (req, res, next) => {
//     const tag = req.query.tag;
//     console.log(tag);

//     res.send('ok');

//   });





router.get('/', function(req, res, next) {
  
  res.render('index', { title: 'Express' });
});

module.exports = router;
