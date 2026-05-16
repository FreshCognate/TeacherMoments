import { describe, it, expect, vi, beforeEach } from 'vitest';

const { checkAccessMock, getSocketsMock, emitMock } = vi.hoisted(() => ({
  checkAccessMock: vi.fn(),
  getSocketsMock: vi.fn(),
  emitMock: vi.fn()
}));

vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));
vi.mock('#core/io/index.js', () => ({
  getSockets: (...args) => getSocketsMock(...args)
}));

import unlockSlide from '../services/unlockSlide.js';

describe('unlockSlide', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
    getSocketsMock.mockReturnValue({ emit: emitMock });
  });

  it('clears the lock fields and emits a socket event', async () => {
    const slide = { _id: 'sl1', scenario: 's1' };
    const findByIdAndUpdate = vi.fn().mockResolvedValue(slide);

    const result = await unlockSlide(
      { slideId: 'sl1' },
      {},
      { models: { Slide: { findByIdAndUpdate } }, user: { _id: 'u1' } }
    );

    expect(checkAccessMock).toHaveBeenCalledWith({ modelId: 'sl1', modelType: 'Slide' }, expect.any(Object));
    expect(findByIdAndUpdate).toHaveBeenCalledWith(
      'sl1',
      { isLocked: false, lockedAt: null, lockedBy: null },
      { new: true }
    );

    expect(emitMock).toHaveBeenCalledWith(
      'SCENARIO:s1_EVENT:SLIDE_LOCK_STATUS',
      { slide, userId: 'u1' }
    );

    expect(result).toBe(slide);
  });
});
