import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

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

import lockSlide from '../services/lockSlide.js';

const FIXED_NOW = new Date('2026-05-07T12:00:00Z');

describe('lockSlide', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
    getSocketsMock.mockReturnValue({ emit: emitMock });
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('throws 404 when the slide does not exist', async () => {
    const findById = vi.fn().mockResolvedValue(null);

    await expect(
      lockSlide(
        { slideId: 'sl1' },
        {},
        { models: { Slide: { findById, updateMany: vi.fn() } }, user: { _id: 'u1' } }
      )
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('clears any existing locks held by this user, locks the requested slide, and emits a socket event', async () => {
    const slide = { _id: 'sl1', scenario: 's1', save: vi.fn().mockResolvedValue() };
    const findById = vi.fn().mockResolvedValue(slide);
    const updateMany = vi.fn().mockResolvedValue({});

    const result = await lockSlide(
      { slideId: 'sl1' },
      {},
      { models: { Slide: { findById, updateMany } }, user: { _id: 'u1' } }
    );

    expect(checkAccessMock).toHaveBeenCalledWith({ modelId: 'sl1', modelType: 'Slide' }, expect.any(Object));
    expect(updateMany).toHaveBeenCalledWith(
      { isLocked: true, lockedBy: 'u1' },
      { isLocked: false, lockedBy: null, lockedAt: null }
    );

    expect(slide.isLocked).toBe(true);
    expect(slide.lockedAt).toEqual(FIXED_NOW);
    expect(slide.lockedBy).toBe('u1');
    expect(slide.save).toHaveBeenCalled();

    expect(emitMock).toHaveBeenCalledWith(
      'SCENARIO:s1_EVENT:SLIDE_LOCK_STATUS',
      { slide, userId: 'u1' }
    );

    expect(result).toBe(slide);
  });
});
