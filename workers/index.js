import './init.js';
import http from 'http';
import express from 'express';
import events from 'events';
events.EventEmitter.prototype._maxListeners = 100;

if (process.env.SHOULD_RUN_WORKERS === 'true') {
  console.log('WORKERS ARE ENABLED');
  const { default: createWorker } = await import('./createWorker.js');
  createWorker({ name: 'generate' }, `${global.root}/runners/generate.js`);
} else {
  const app = express();
  app.disable('x-powered-by');

  const server = http.createServer(app);
  server.listen(9998, () => {
    console.log('LISTENING');
  });
  console.log('WORKERS ARE DISABLED');
}

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error(`Caught exception: ${error}\n` + `Exception origin: ${error.stack}`);
});

process.on('SIGINT', () => process.exit(1));