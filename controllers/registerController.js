'use strict';

const Usuario = require('../models/Usuario');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

const registerController = () => {
  return {
    /**
     * POST /login, crear usuario
    */
    index: async (req, res, next) => {
      try {
        const { email, nickname, password } = req.body;
        const user = new Usuario(
          { 
            email,
            nickname,
            password: await Usuario.hashPassword(password)
          });
        const userSaved = await user.save();
        res.json({ sucess: true, result: userSaved });

      } catch (err) {
        next(err);
      }
    }
  }
}
  

module.exports = registerController;
