import { describe, it, expect, vi, beforeEach } from 'vitest';

const { flowProducerAddMock, FlowProducerMock, getQueueMock, RedisMock } = vi.hoisted(() => ({
  flowProducerAddMock: vi.fn(),
  FlowProducerMock: vi.fn(),
  getQueueMock: vi.fn(),
  RedisMock: vi.fn()
}));

vi.mock('bullmq', () => ({
  FlowProducer: function (...args) {
    FlowProducerMock(...args);
    return { add: flowProducerAddMock };
  }
}));

vi.mock('ioredis', () => ({
  default: function (...args) { return RedisMock(...args); }
}));

vi.mock('../helpers/getQueue.js', () => ({
  default: (...args) => getQueueMock(...args)
}));

import createJob from '../helpers/createJob.js';

describe('createJob', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('flow with children', () => {
    it('creates a FlowProducer flow with the parent and children', async () => {
      flowProducerAddMock.mockResolvedValue({ job: { id: 'parent-job' } });

      const result = await createJob({
        queue: 'generate',
        name: 'parent',
        job: { foo: 'bar' },
        children: [
          { name: 'child-1', queue: 'assets', job: { type: 'image' } },
          { name: 'child-2', queue: 'assets', job: { type: 'video' } }
        ]
      });

      expect(flowProducerAddMock).toHaveBeenCalledWith({
        name: 'parent',
        queueName: 'generate',
        data: { foo: 'bar' },
        children: [
          { name: 'child-1', queueName: 'assets', data: { type: 'image' } },
          { name: 'child-2', queueName: 'assets', data: { type: 'video' } }
        ]
      });
      expect(result).toEqual({ id: 'parent-job' });
    });

    it('does not call getQueue when using the flow path', async () => {
      flowProducerAddMock.mockResolvedValue({ job: {} });

      await createJob({
        queue: 'generate',
        name: 'parent',
        job: {},
        children: [{ name: 'child-1', queue: 'assets', job: {} }]
      });

      expect(getQueueMock).not.toHaveBeenCalled();
    });
  });

  describe('repeat', () => {
    it('adds a repeating job using the queue.add API with only the repeat option', async () => {
      const addMock = vi.fn().mockResolvedValue({ id: 'job-1' });
      getQueueMock.mockReturnValue({ add: addMock });

      const repeat = { every: 60_000 };
      await createJob({ queue: 'generate', name: 'tick', job: { foo: 'bar' }, repeat });

      expect(getQueueMock).toHaveBeenCalledWith('generate');
      expect(addMock).toHaveBeenCalledWith('tick', { foo: 'bar' }, { repeat });
    });
  });

  describe('default add', () => {
    it('adds a one-shot job with removeOnComplete and removeOnFail retention', async () => {
      const addMock = vi.fn().mockResolvedValue({ id: 'job-1' });
      getQueueMock.mockReturnValue({ add: addMock });

      await createJob({ queue: 'generate', name: 'work', job: { foo: 'bar' } });

      expect(addMock).toHaveBeenCalledWith('work', { foo: 'bar' }, {
        removeOnComplete: { age: 72 * 3600, count: 2000 },
        removeOnFail: { age: 72 * 3600, count: 2000 }
      });
    });
  });
});
