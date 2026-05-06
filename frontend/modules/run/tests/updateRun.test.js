import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import updateRun from '../helpers/updateRun';
import { createCache, resetCache, getCache } from '~/core/cache/helpers/cacheManager';

const seedRun = (data) => {
  resetCache('run');
  createCache({
    key: 'run',
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

const setEditorPathname = () => {
  window.history.replaceState({}, '', '/scenarios/scenario-1/create');
};

const setPlayPathname = () => {
  window.history.replaceState({}, '', '/play/scenario-1');
};

describe('updateRun', () => {
  const originalUrl = window.location.href;

  beforeEach(() => {
    setEditorPathname();
    seedRun({
      stages: [{
        slideRef: 'ref-1',
        isComplete: false,
        blocksByRef: {
          'b-1': { textValue: 'before', isComplete: false }
        }
      }]
    });
  });

  afterEach(() => {
    window.history.replaceState({}, '', originalUrl);
  });

  it('extends an existing block tracking entry with the update', async () => {
    await updateRun({
      slideRef: 'ref-1',
      blockRef: 'b-1',
      update: { textValue: 'after' }
    });

    expect(getCache('run').data.stages[0].blocksByRef['b-1']).toEqual({
      textValue: 'after',
      isComplete: false
    });
  });

  it('creates a new block tracking entry when none exists', async () => {
    await updateRun({
      slideRef: 'ref-1',
      blockRef: 'b-2',
      update: { textValue: 'new', isComplete: false }
    });

    expect(getCache('run').data.stages[0].blocksByRef['b-2']).toEqual({
      textValue: 'new',
      isComplete: false
    });
  });

  it('marks the stage complete when an isComplete update makes every block complete', async () => {
    await updateRun({
      slideRef: 'ref-1',
      blockRef: 'b-1',
      update: { isComplete: true }
    });

    const stage = getCache('run').data.stages[0];
    expect(stage.isComplete).toBe(true);
    expect(stage.completedAt).toBeInstanceOf(Date);
  });

  it('does not mark the stage complete if other blocks are still incomplete', async () => {
    seedRun({
      stages: [{
        slideRef: 'ref-1',
        isComplete: false,
        blocksByRef: {
          'b-1': { isComplete: false },
          'b-2': { isComplete: false }
        }
      }]
    });

    await updateRun({
      slideRef: 'ref-1',
      blockRef: 'b-1',
      update: { isComplete: true }
    });

    const stage = getCache('run').data.stages[0];
    expect(stage.isComplete).toBe(false);
    expect(stage.blocksByRef['b-1'].isComplete).toBe(true);
    expect(stage.blocksByRef['b-2'].isComplete).toBe(false);
  });

  it('mutates the run cache via PUT in play mode', async () => {
    setPlayPathname();
    const mutate = vi.spyOn(getCache('run'), 'mutate');

    await updateRun({
      slideRef: 'ref-1',
      blockRef: 'b-1',
      update: { textValue: 'after' }
    });

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({
          stages: expect.arrayContaining([
            expect.objectContaining({ slideRef: 'ref-1' })
          ])
        }),
        options: { method: 'put' }
      }),
      undefined
    );
  });
});
