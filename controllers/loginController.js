'use strict';

const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

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
        console.log('Email: ', email);
        console.log('Password: ', password);
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
    }
    
  }
}

module.exports = loginController;