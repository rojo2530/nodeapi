'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcrypt');
const nodemailerTransport = require('../lib/nodemailerConfigure');


// definimos un esquema
const usuarioSchema = mongoose.Schema({
  email: { type: String, required: true, index: true, unique: true },
  nickname: { type: String, required: true, index: true, unique: true },
  password: { type: String, required: true},
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
});

usuarioSchema.plugin(uniqueValidator);

usuarioSchema.statics.hashPassword = function (plainPassword) {
  return bcrypt.hash(plainPassword, 10);
}

usuarioSchema.methods.sendEmail = function(from, subject, body) {
  // enviar el correo
  return nodemailerTransport.sendMail({
    from: from,
    to: this.email,
    subject: subject,
    html: body
  })
}

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;