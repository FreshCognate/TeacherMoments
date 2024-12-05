import events from 'events';
events.EventEmitter.prototype._maxListeners = 100;
import './events/index.js';
import './users/index.js';
// Must be imported last
import './server.js';

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error(`Caught exception: ${error}\n` + `Exception origin: ${error.stack}`);
});