import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('axios', () => ({
  default: { post: vi.fn() }
}));

const socketHandlers = new Map();
const mockSocket = {
  on: vi.fn((eventName, handler) => {
    socketHandlers.set(eventName, handler);
  })
};

vi.mock('~/core/sockets/helpers/getSockets', () => ({
  default: vi.fn(() => Promise.resolve(mockSocket))
}));

import axios from 'axios';
import generate from '../helpers/generate.js';

describe('generate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    socketHandlers.clear();
  });

  it('resolves on GENERATED events and ignores other socket events', async () => {
    axios.post.mockResolvedValue({ data: { jobId: 'job-1' } });
    const promise = generate({ generateType: 'SCENARIO', payload: {} });
    await new Promise((r) => setTimeout(r, 0));

    const handler = socketHandlers.get('workers:generate:job-1');
    handler({ event: 'PROGRESS', percent: 25 });
    handler({ event: 'STARTED' });

    let resolvedValue;
    promise.then((value) => { resolvedValue = value; });
    await new Promise((r) => setTimeout(r, 0));
    expect(resolvedValue).toBeUndefined();

    handler({ event: 'GENERATED', result: { ok: true } });
    const final = await promise;
    expect(final).toEqual({ event: 'GENERATED', result: { ok: true } });
  });
});
