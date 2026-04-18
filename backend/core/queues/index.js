import createQueue from './helpers/createQueue.js';

createQueue({ name: 'generate' });
createQueue({ name: 'assets' });
createQueue({ name: 'exports' });
createQueue({ name: 'upgrades' });
createQueue({ name: 'migrations' });