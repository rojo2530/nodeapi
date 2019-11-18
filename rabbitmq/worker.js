'use strict';

process.env.RABBITMQ_URL='amqp://gluahsun:ZzNHyXt5aaZ78Ixv603YaSF3S4VjRhLb@hedgehog.rmq.cloudamqp.com/gluahsun';

const connectionPromise = require('./connectAMQP');
const Jimp = require('jimp');
const path = require('path');
const queueName = 'thumbnail';

const imagesPath = path.join('..', 'public', 'images', '/');


const createTransport = async () => {
  //Conectamos al servidor AMPQ
  const conn = await connectionPromise;
  //creamos un canal
  const channel = await conn.createChannel();
  //aseguramos de que la cola existe
  await channel.assertQueue(queueName, {
    durable: true,
  });

  channel.prefetch(1);

  return channel;
}

const createThumbnail = (image, dest) => {
  return Jimp.read(image.imagePath)
    .then(thumbnail => {
      return thumbnail.resize(100,100).quality(image.quality).write(dest)
    });
}

const consumeTask = async() => {
  const channel = await createTransport();
  channel.consume(queueName, msg => {
    const image = JSON.parse(msg.content);
    const thumbnailName = path.parse(image.imagePath).name + '-thumbail' + '.jpg';
    createThumbnail(image, imagesPath + thumbnailName)
      .then(() => channel.ack(msg))
      .catch(err => console.log(err));
    });
}

consumeTask().catch(err => console.log('Hubo un error, ', err));


