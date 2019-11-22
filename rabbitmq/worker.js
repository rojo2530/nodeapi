'use strict';

require('dotenv').config();
const connectionPromise = require('./connectAMQP');
const Jimp = require('jimp');
const path = require('path');
const queueName = 'thumbnail';

const imagesPath = path.join(__dirname, '..', 'public', 'images', '/');

const createTransport = async () => {
  try {
    //Conectamos al servidor AMPQ
    const conn = await connectionPromise;
    //creamos un canal
    const channel = await conn.createChannel();
    //aseguramos de que la cola existe
    await channel.assertQueue(queueName, {
      durable: true,
    });
    channel.prefetch(1);
    console.log('Woker connected to Rabbitmq Server');
    return channel;
  } catch (error) {
    console.log(error);
  }
}

const createThumbnail = (image, dest) => {
  // console.log(imagesPath + image.imageName);
  return Jimp.read(imagesPath + image.imageName)
    .then(thumbnail => {
      return thumbnail.resize(100,100).quality(image.quality).write(dest)
    });
}

const consumeTask = async() => {
  const channel = await createTransport();
  channel.consume(queueName, msg => {
    const image = JSON.parse(msg.content);
    const thumbnailName = path.parse(image.imageName).name + '-thumbail' + '.jpg';
    createThumbnail(image, imagesPath + thumbnailName)
      .then(() => {
        console.log('Thumbnail created for ' + image.imageName);
        channel.ack(msg);
      })
      .catch(err => console.log(err));
    });
}

consumeTask().catch(err => console.log('Hubo un error, ', err));


