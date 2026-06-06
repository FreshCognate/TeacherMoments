import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { checkAccessMock, getSocketsMock, emitMock } = vi.hoisted(() => ({
  checkAccessMock: vi.fn(),
  getSocketsMock: vi.fn(),
  emitMock: vi.fn()
}));

vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({ default: (...args) => checkAccessMock(...args) }));
vi.mock('#core/io/index.js', () => ({ getSockets: (...args) => getSocketsMock(...args) }));

import lockSlide from '../services/lockSlide.js';

const db = setupMongo();

describe('lockSlide (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
    getSocketsMock.mockReturnValue({ emit: emitMock });
  });

  it('throws 404 when the slide does not exist', async () => {
    await expect(
      lockSlide({ slideId: new mongoose.Types.ObjectId() }, {}, { models: db.models, user: { _id: new mongoose.Types.ObjectId() } })
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('clears existing locks held by the user, locks the slide, and emits a socket event', async () => {
    const userId = new mongoose.Types.ObjectId();
    const scenario = new mongoose.Types.ObjectId();
    const stemRef = new mongoose.Types.ObjectId();

    const previouslyLocked = await db.models.Slide.create({ scenario, stemRef, sortOrder: 0, isLocked: true, lockedBy: userId, lockedAt: new Date() });
    const target = await db.models.Slide.create({ scenario, stemRef, sortOrder: 1 });

    const result = await lockSlide({ slideId: target._id }, {}, { models: db.models, user: { _id: userId } });

    const storedTarget = await db.models.Slide.findById(target._id).lean();
    expect(storedTarget.isLocked).toBe(true);
    expect(String(storedTarget.lockedBy)).toBe(String(userId));
    expect(storedTarget.lockedAt).toBeInstanceOf(Date);

    const storedPrevious = await db.models.Slide.findById(previouslyLocked._id).lean();
    expect(storedPrevious.isLocked).toBe(false);
    expect(storedPrevious.lockedBy).toBeNull();

    expect(emitMock).toHaveBeenCalledWith(
      `SCENARIO:${scenario}_EVENT:SLIDE_LOCK_STATUS`,
      expect.objectContaining({ userId })
    );
    expect(String(result._id)).toBe(String(target._id));
  });
});
