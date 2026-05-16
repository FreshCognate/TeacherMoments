import { describe, it, expect, vi, beforeEach } from 'vitest';

const { QueueMock, RedisMock } = vi.hoisted(() => ({
  QueueMock: vi.fn(),
  RedisMock: vi.fn()
}));

vi.mock('bullmq', () => ({
  Queue: function (...args) { return QueueMock(...args); }
}));

vi.mock('ioredis', () => ({
  default: function (...args) { return RedisMock(...args); }
}));

import QUEUES from '../queues.js';
import createQueue from '../helpers/createQueue.js';

describe('createQueue', () => {
  beforeEach(() => {
    Object.keys(QUEUES).forEach((key) => delete QUEUES[key]);
    vi.clearAllMocks();
  });

  it('creates a BullMQ Queue with the given name', () => {
    const fakeQueueInstance = { name: 'generate' };
    QueueMock.mockReturnValue(fakeQueueInstance);

    createQueue({ name: 'generate' });

    expect(QueueMock).toHaveBeenCalledWith('generate', expect.objectContaining({
      connection: expect.anything()
    }));
  });

  it('stores the created queue under its name in QUEUES', () => {
    const fakeQueueInstance = { name: 'generate' };
    QueueMock.mockReturnValue(fakeQueueInstance);

    createQueue({ name: 'generate' });

    expect(QUEUES.generate).toBe(fakeQueueInstance);
  });

  it('supports creating multiple distinct queues', () => {
    QueueMock.mockImplementation((name) => ({ name }));

    createQueue({ name: 'generate' });
    createQueue({ name: 'assets' });

    expect(QUEUES.generate).toEqual({ name: 'generate' });
    expect(QUEUES.assets).toEqual({ name: 'assets' });
  });
});
