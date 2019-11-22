'use strict';

//Lo hago así por el tema de los test
// const connectionPromise = require('./connectAMQP');

const queueName = 'thumbnail';

const createTransport = async () => {
  //Conectamos al servidor AMPQ
  const conn = await require('./connectAMQP');
  //creamos un canal
  const channel = await conn.createChannel();
  //aseguramos de que la cola existe
  await channel.assertQueue(queueName, {
    durable: true,
  });
  console.log('NodeApi publisher connected to Rabbitmq Server');
  return channel;
}

const createTask = async (message) => {
  const channel = await createTransport();
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
  console.log(`Publish "${message.texto}"`);
}

module.exports = createTask;