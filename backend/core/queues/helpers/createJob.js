import { FlowProducer } from 'bullmq';
import getQueue from './getQueue.js';
import map from 'lodash/map.js';
import Redis from 'ioredis';
import QUEUES from '../queues.js';



export default async ({ queue, name, repeat, job, children }) => {

  if (children) {
    const urlRedis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null
    });
    const flowProducer = new FlowProducer({ connection: urlRedis });
    const flow = {
      name,
      queueName: queue,
      data: job,
      children: map(children, (child) => {
        return {
          name: child.name,
          queueName: child.queue,
          data: child.job
        }
      })
    };
    const flowTree = await flowProducer.add(flow);
    return flowTree.job;
  }

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