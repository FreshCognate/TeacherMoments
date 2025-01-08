import { on, emit } from '#core/events/index.js';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import passportSocketIo from 'passport.socketio';
import cookieParser from 'cookie-parser';

let SOCKETS = {};

on('core:server:started', async function ({ server, sessionStore }) {

  const io = new Server(server, { path: `${process.env.API_PREFIX}/sockets` });

  const pubClient = createClient({
    socket: {
      tls: true
    },
    pingInterval: 4 * 60 * 1000,
    url: process.env.REDIS_URL
  });
  pubClient.on('error', (err) => console.log('PubClient:Redis Client Error', err));

  const subClient = pubClient.duplicate();

  subClient.on('error', (err) => console.log('SubClient:Redis Client Error', err));

  await pubClient.connect();
  await subClient.connect();

  io.adapter(createAdapter(pubClient, subClient));

  io.use((socket, next) => {

    try {
      passportSocketIo.authorize({
        cookieParser,
        key: 'express.sid',
        secret: process.env.SESSION_SECRET,
        store: sessionStore,
        success: (data, accept) => {
          accept();
        },
        fail: (data, message, fatal, accept) => {
          console.info('Failed', message, fatal);
        },
      })(socket, next);
    } catch (error) {
      console.info(error);
    }
  });

  io.on("connection", (socket) => {

    emit('core:io:connected', socket);

  });

  SOCKETS = io;

});

const getSockets = (context) => {
  return SOCKETS.sockets;
};

export {
  getSockets
};