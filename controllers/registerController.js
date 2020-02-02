'use strict';

const Usuario = require('../models/Usuario');

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
            password: await Usuario.hashPassword(password),
            resetPasswordToken: null,
            resetPasswordExpires: null
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

