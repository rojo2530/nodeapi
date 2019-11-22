'use strict';
require('dotenv').config();

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../appTest');

const token = jwt.sign({ _id: 'prueba' }, process.env.JWT_SECRET, {
  expiresIn: '2D',
});

beforeAll(async () => {
  const url = 'mongodb://localhost/anunciosdb';
  await mongoose.connect(url, { useNewUrlParser: true });
});

test('[INCORRECT AUTH] POST /login should return a success false', async () => {
  const credentials = {
    email: 'pepe@pepe.com',
    password: 1234
  }
  const response = await request(app).post('/apiv1/login').send(credentials).expect(200);
  expect(response.body.success).toBe(false);
  expect(response.body.error).toBe('Invalid credentials');
});

test('[AUTH] POST /login should return a success true', async () => {
  const credentials = {
    email: 'admin@example.com',
    password: '1234'
  }
  const response = await request(app).post('/apiv1/login').send(credentials).expect(200);
  expect(response.body.success).toBe(true);
});

test('[NO AUTH] GET /tags should return a success false', async () => {
  const response = await request(app).get('/apiv1/tags').expect(401);
  expect(response.body.sucesss).toBe(false);
});

test('[NO AUTH] GET /anuncios should return a success false', async () => {
  const response = await request(app).get('/apiv1/anuncios').expect(401);
  expect(response.body.sucesss).toBe(false);
});

test('[AUTH] GET /tags should return a success json response', async () => {
  const response = await request(app).
    get('/apiv1/tags').set('Authorization', token).expect(200);
  expect(response.body.sucess).toBe(true);
});

test('[AUTH] GET /anuncios should return a success json response', async () => {
  const response = await request(app).
    get('/apiv1/anuncios').set('Authorization', token).expect(200);

  expect(response.body.sucess).toBe(true);
  expect(response.body.results[0]._id).toEqual(expect.any(String));
  expect(response.body.results[0].nombre).toEqual(expect.any(String));
  expect(response.body.results[0].venta).toEqual(expect.any(Boolean));
  expect(response.body.results[0].precio).toEqual(expect.any(Number));
  expect(response.body.results[0].foto).toEqual(expect.any(String));
  expect(response.body.results[0].tags).toEqual(expect.any(Array));
})

afterAll(done => {
  mongoose.connection.close();
  done();
})