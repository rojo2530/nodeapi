'use strict';

const amqplib = require('amqplib');

const urlConnection = process.env.RABBITMQ_URL;

if (!urlConnection) {  
  console.error("Please set the COMPOSE_RABBITMQ_URL environment variable");
  process.exit(1);
}

const connectionPromise = amqplib.connect(urlConnection);

module.exports = connectionPromise;