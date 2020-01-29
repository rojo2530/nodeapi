'use strict';

const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginController = () => {
  return {
    /**
     * GET /login
     */
    index: (req, res, next) => {
      res.locals.email = '';
      res.locals.error = '';
      res.render('login');
    },
    /**
     * POST /login
     */
    post: async (req, res, next) => {
      try {
        const { email, password }  = req.body;
        
        //buscar el usuario en la base de datos
        const usuario = await Usuario.findOne({ email: email })
        if (!usuario || !await bcrypt.compare(password, usuario.password)) {
          res.locals.error = res.__('Invalid credentials');
          res.locals.email = email;
          res.render('login');
          return;
  
        }
        //si encuentro el usuario ...compruebo la password
        req.session.authUser = {
          _id: usuario._id
        };

        console.log(req.session);
        res.redirect('/');
      } catch (err) {
        next(err);
      }
    },

    logout: (req, res, next) => {
      req.session.regenerate(err => {
        if (err) {
          next(err);
          return;
        }
        res.redirect('/login');
      });
    },

    loginJWT: async (req, res, next) => {
      try {
        const { nickname, password } = req.body;
        const user = await Usuario.findOne({ nickname });
        if (!user || !await bcrypt.compare(password, user.password)) {
          res.json({ success: false, error: 'Invalid credentials' });
          return;
        }
        //creamos un jwt si hemos llegado hasta aquí
        const token = jwt.sign({ _id: user._id, email: user.email, nickname: user.nickname }, process.env.JWT_SECRET, {
          expiresIn: '2D',
        });
        // res.json({ success: true, token });
        res.cookie('token', token, { httpOnly: true })
            .sendStatus(200); 
      } catch(err) {
        next(err);
      }
    },

    
  }
}

module.exports = loginController;