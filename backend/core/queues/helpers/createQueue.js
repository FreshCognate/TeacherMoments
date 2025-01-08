import { Queue } from 'bullmq';
import Redis from 'ioredis';
import QUEUES from '../queues.js';

const urlRedis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null
});

export default ({ name }) => {
  const queue = new Queue(name, {
    connection: urlRedis
  });
  QUEUES[name] = queue;
};