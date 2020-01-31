'use strict';

const crypto = require('crypto');
const Usuario = require('../models/Usuario');

const userController = () => {
  return {
    /**
     * Forgot Password
     */
    forgotPassword: async (req, res, next) => {
      try {
        const { email } = req.body;
        if (email === '' || !email) {
          res.status(400).send('email required');
        }
        const user = await Usuario.findOne({ email })
        if (user === null) {
          return res.status(403).send('email not in db');
        }
        const token = crypto.randomBytes(20).toString('hex');
        //Actualizamos el ususario con el token
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();
          const result = await user.sendEmail('admin@example.com', 'Link to Reset Password',  
          'You are receiving this because you (or someone else) have requested the reset of the password for your account.<br><br>'
          + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:<br><br>'
          + `http://localhost:3000/reset/${token}<br><br>`
          + 'If you did not request this, please ignore this email and your password will remain unchanged.<br>');
          console.log(result);
          res.status(200).send('ok recovery mail sent');

      } catch (error) {
        res.status(500).send(error);
      }
    },
    reset: async (req, res, next) => {
      const user = await Usuario.findOne({ 
        resetPasswordToken: req.query.resetPasswordToken,
        resetPasswordExpires: {
          $gt: Date.now(),
        }
      });

      if (user === null) {
        return res.json('password reset link is invalid or has expired')
      }

      res.status(200).json({
        nickname: user.nickname,
        message: 'password link reset is ok'
      });

    },
    updatePassword: async (req, res, next) => {
      const { email, password } = req.body;
      const user = await Usuario.findOne({ email });
      if (user === null) {
        return res.status(404).json('user not exists in db');
      }
      if(!password) {
        return res.status(404).json('password can not be empty');
      }
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      user.password = await Usuario.hashPassword(password),
      user.save();
      res.status(200).json({ message: 'password updated'})
    }
  }
}

module.exports = userController;