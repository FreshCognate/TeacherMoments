import { describe, it, expect, vi, beforeEach } from 'vitest';

const { checkAccessMock, setHasChangesMock } = vi.hoisted(() => ({
  checkAccessMock: vi.fn(),
  setHasChangesMock: vi.fn()
}));

vi.mock('../../scenarios/helpers/checkHasAccessToScenario.js', () => ({
  default: (...args) => checkAccessMock(...args)
}));
vi.mock('../../scenarios/services/setScenarioHasChanges.js', () => ({
  default: (...args) => setHasChangesMock(...args)
}));

import deleteStemById from '../services/deleteStemById.js';

const buildConnection = () => ({
  transaction: vi.fn().mockImplementation((cb) => {
    const promise = (async () => { await cb('SESSION_TOKEN'); })();
    promise.catch = (handler) => promise.then(undefined, handler);
    return promise;
  })
});

describe('deleteStemById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAccessMock.mockResolvedValue();
  });

  it('throws 404 when the stem does not exist', async () => {
    const findById = vi.fn().mockResolvedValue(null);

    await expect(
      deleteStemById(
        { stemId: 'st1' },
        {},
        {
          models: {
            Stem: { findById, find: vi.fn(), save: vi.fn() },
            Slide: { updateMany: vi.fn() },
            Block: { updateMany: vi.fn() }
          },
          user: { _id: 'u1' },
          connection: buildConnection()
        }
      )
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('soft-deletes the stem and recursively cascades to descendants (slides, blocks, child stems)', async () => {
    const rootStem = {
      _id: 'rootId',
      ref: 'rootRef',
      scenario: 's1',
      save: vi.fn().mockResolvedValue()
    };

    const childStem = {
      _id: 'childId',
      ref: 'childRef',
      save: vi.fn().mockResolvedValue()
    };

    const findById = vi.fn().mockResolvedValue(rootStem);

    // First find call (stems with stemRef=rootRef) returns [childStem].
    // Second find call (stems with stemRef=childRef) returns [].
    const stemFind = vi.fn();
    stemFind.mockReturnValueOnce({ session: vi.fn().mockResolvedValue([childStem]) });
    stemFind.mockReturnValueOnce({ session: vi.fn().mockResolvedValue([]) });

    const slideUpdateMany = vi.fn(() => ({ session: vi.fn().mockResolvedValue({}) }));
    const blockUpdateMany = vi.fn(() => ({ session: vi.fn().mockResolvedValue({}) }));

    const context = {
      models: {
        Stem: { findById, find: stemFind },
        Slide: { updateMany: slideUpdateMany },
        Block: { updateMany: blockUpdateMany }
      },
      user: { _id: 'u1' },
      connection: buildConnection()
    };

    const result = await deleteStemById({ stemId: 'rootId' }, {}, context);

    expect(checkAccessMock).toHaveBeenCalledWith({ modelId: 'rootId', modelType: 'Stem' }, context);

    // Root stem flagged deleted and saved within the transaction session
    expect(rootStem.isDeleted).toBe(true);
    expect(rootStem.deletedBy).toBe('u1');
    expect(rootStem.deletedAt).toBeInstanceOf(Date);
    expect(rootStem.save).toHaveBeenCalledWith({ session: 'SESSION_TOKEN' });

    // Slides + blocks were soft-deleted at every level (root + child = 2 invocations each)
    expect(slideUpdateMany).toHaveBeenCalledTimes(2);
    expect(slideUpdateMany).toHaveBeenNthCalledWith(
      1,
      { stemRef: 'rootRef', isDeleted: false },
      expect.objectContaining({ isDeleted: true, deletedBy: 'u1' })
    );
    expect(slideUpdateMany).toHaveBeenNthCalledWith(
      2,
      { stemRef: 'childRef', isDeleted: false },
      expect.objectContaining({ isDeleted: true, deletedBy: 'u1' })
    );

    expect(blockUpdateMany).toHaveBeenCalledTimes(2);
    expect(blockUpdateMany).toHaveBeenNthCalledWith(
      1,
      { stemRef: 'rootRef', isDeleted: false },
      expect.objectContaining({ isDeleted: true, deletedBy: 'u1' })
    );

    // Child stem also flagged + saved
    expect(childStem.isDeleted).toBe(true);
    expect(childStem.deletedBy).toBe('u1');
    expect(childStem.save).toHaveBeenCalledWith({ session: 'SESSION_TOKEN' });

    // Recursion looked up children twice (once for root, once for child)
    expect(stemFind).toHaveBeenCalledTimes(2);
    expect(stemFind).toHaveBeenNthCalledWith(1, { stemRef: 'rootRef', isDeleted: false });
    expect(stemFind).toHaveBeenNthCalledWith(2, { stemRef: 'childRef', isDeleted: false });

    expect(setHasChangesMock).toHaveBeenCalledWith({ scenarioId: 's1' }, {}, context);
    expect(result).toBe(rootStem);
  });
});
