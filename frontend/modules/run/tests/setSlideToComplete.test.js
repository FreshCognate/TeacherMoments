import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../helpers/getScenarioDetails', () => ({
  default: vi.fn(() => ({ activeSlideRef: 'ref-1' }))
}));

import setSlideToComplete from '../helpers/setSlideToComplete';
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

describe('setSlideToComplete', () => {
  const originalUrl = window.location.href;

  beforeEach(() => {
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
    setEditorPathname();
  });

  afterEach(() => {
    window.history.replaceState({}, '', originalUrl);
  });

  it('marks the active stage and all its blocks as complete in edit mode', () => {
    setSlideToComplete({ slideRef: 'ref-1' });
    const stage = getCache('run').data.stages[0];
    expect(stage.isComplete).toBe(true);
    expect(stage.completedAt).toBeInstanceOf(Date);
    expect(stage.blocksByRef['b-1'].isComplete).toBe(true);
    expect(stage.blocksByRef['b-2'].isComplete).toBe(true);
  });

  it('does nothing when the stage is already complete', () => {
    seedRun({
      stages: [{
        slideRef: 'ref-1',
        isComplete: true,
        completedAt: 'preserved',
        blocksByRef: { 'b-1': { isComplete: false } }
      }]
    });

    setSlideToComplete({ slideRef: 'ref-1' });

    const stage = getCache('run').data.stages[0];
    expect(stage.completedAt).toBe('preserved');
    expect(stage.blocksByRef['b-1'].isComplete).toBe(false);
  });

  it('mutates the run cache via PUT in play mode', () => {
    setPlayPathname();
    const mutate = vi.spyOn(getCache('run'), 'mutate');

    setSlideToComplete({ slideRef: 'ref-1' });

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({
          stages: expect.arrayContaining([
            expect.objectContaining({ slideRef: 'ref-1', isComplete: true })
          ])
        }),
        options: { method: 'put' }
      }),
      undefined
    );
  });
});
