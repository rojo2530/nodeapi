'use strict';

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.body.token || req.query.token || req.get('Authorization');
  if (!token) {
    const err = new Error('no token provided');
    err.status = 401;
    next(err);
    return;
  }
  // si el token es invalido no dejo pasar
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      err.status = 401;
      next(err);
      return;
    }
    //Guardo el id por si luego lo necesitara en otro middleware
    req.apiUserId = payload._id;
    next();
  });
}