'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcrypt');

// definimos un esquema
const usuarioSchema = mongoose.Schema({
  email: { type: String, required: true, index: true, unique: true },
  nickname: { type: String, required: true, index: true, unique: true },
  password: { type: String, required: true},
});

usuarioSchema.plugin(uniqueValidator);

usuarioSchema.statics.hashPassword = function (plainPassword) {
  return bcrypt.hash(plainPassword, 10);
}
const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;