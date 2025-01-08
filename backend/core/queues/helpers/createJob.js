import getQueue from './getQueue.js';

export default ({ queue, name, repeat, job }) => {
  const queueItem = getQueue(queue);
  if (repeat) {
    return queueItem.add(name, job, {
      repeat
    });
  }
  queueItem.add(name, job, {
    removeOnComplete: {
      age: 72 * 3600, // keep up to 1 hour
      count: 2000, // keep up to 2000 jobs
    },
    removeOnFail: {
      age: 72 * 3600,
      count: 2000,
    },
  });
};