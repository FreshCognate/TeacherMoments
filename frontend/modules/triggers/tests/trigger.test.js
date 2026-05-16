import { describe, it, expect, vi, beforeEach } from 'vitest';

const getCacheMock = vi.fn();
vi.mock('~/core/cache/helpers/getCache', () => ({
  default: (key) => getCacheMock(key)
}));

const getTriggerMock = vi.fn();
vi.mock('../helpers/getTrigger', () => ({
  default: (action) => getTriggerMock(action)
}));

import trigger from '../helpers/trigger.js';

describe('trigger (run-all)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('runs each matching trigger in sortOrder', async () => {
    const callOrder = [];
    const triggerA = { trigger: vi.fn(async () => { callOrder.push('A'); }) };
    const triggerB = { trigger: vi.fn(async () => { callOrder.push('B'); }) };
    const triggerC = { trigger: vi.fn(async () => { callOrder.push('C'); }) };

    getTriggerMock.mockImplementation((action) => {
      if (action === 'A') return triggerA;
      if (action === 'B') return triggerB;
      if (action === 'C') return triggerC;
    });

    getCacheMock.mockReturnValue({
      data: [
        { action: 'A', triggerType: 'SLIDE', elementRef: 'slide-1', sortOrder: 2 },
        { action: 'B', triggerType: 'SLIDE', elementRef: 'slide-1', sortOrder: 0 },
        { action: 'C', triggerType: 'SLIDE', elementRef: 'slide-1', sortOrder: 1 }
      ]
    });

    await trigger({ triggerType: 'SLIDE', elementRef: 'slide-1' }, { ctx: 'value' });

    expect(callOrder).toEqual(['B', 'C', 'A']);
  });

  it('skips triggers whose elementRef or triggerType do not match', async () => {
    const triggerA = { trigger: vi.fn() };
    const triggerB = { trigger: vi.fn() };

    getTriggerMock.mockImplementation((action) => action === 'A' ? triggerA : triggerB);

    getCacheMock.mockReturnValue({
      data: [
        { action: 'A', triggerType: 'SLIDE', elementRef: 'slide-1', sortOrder: 0 },
        { action: 'B', triggerType: 'BLOCK', elementRef: 'slide-1', sortOrder: 1 }
      ]
    });

    await trigger({ triggerType: 'SLIDE', elementRef: 'slide-1' }, {});

    expect(triggerA.trigger).toHaveBeenCalled();
    expect(triggerB.trigger).not.toHaveBeenCalled();
  });

  it('passes the trigger and context to each trigger\'s handler', async () => {
    const triggerA = { trigger: vi.fn(async () => {}) };
    getTriggerMock.mockReturnValue(triggerA);
    const triggerData = { action: 'A', triggerType: 'SLIDE', elementRef: 'slide-1', sortOrder: 0 };
    getCacheMock.mockReturnValue({ data: [triggerData] });

    await trigger({ triggerType: 'SLIDE', elementRef: 'slide-1' }, { run: 'data' });

    expect(triggerA.trigger).toHaveBeenCalledWith({ trigger: triggerData, context: { run: 'data' } });
  });

  it('resolves cleanly when there are no matching triggers', async () => {
    getCacheMock.mockReturnValue({ data: [] });
    await expect(trigger({ triggerType: 'SLIDE', elementRef: 'slide-x' }, {})).resolves.toBeUndefined();
  });
});
