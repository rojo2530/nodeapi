'use strict';

const amqplib = require('amqplib');

console.log(process.env.RABBITMQ_URL);

const connectionPromise = amqplib.connect(process.env.RABBITMQ_URL);

module.exports = connectionPromise;