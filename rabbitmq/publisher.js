'use strict';

const connectionPromise = require('./connectAMQP');

const queueName = 'thumbnail';

const createTransport = async () => {
  //Conectamos al servidor AMPQ
  const conn = await connectionPromise;
  //creamos un canal
  const channel = await conn.createChannel();
  //aseguramos de que la cola existe
  await channel.assertQueue(queueName, {
    durable: true,
  });

  return channel;
}

const createTask = async (message) => {
  const channel = await createTransport();
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
  console.log(`publicado "${message.texto}"`);
}

module.exports = createTask;