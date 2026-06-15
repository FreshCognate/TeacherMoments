import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../helpers/getScenarioDetails', () => ({
  default: vi.fn()
}));

import ensureCurrentStage from '../helpers/ensureCurrentStage';
import getScenarioDetails from '../helpers/getScenarioDetails';
import { createCache, resetCache, getCache } from '~/core/cache/helpers/cacheManager';

const seed = (key, data) => {
  resetCache(key);
  createCache({
    key,
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

describe('ensureCurrentStage', () => {
  const originalUrl = window.location.href;

  beforeEach(() => {
    setEditorPathname();
    seed('blocks', []);
    seed('run', { stages: [] });
  });

  afterEach(() => {
    window.history.replaceState({}, '', originalUrl);
  });

  it('returns null when there is no active slide', () => {
    getScenarioDetails.mockReturnValue({ activeSlideRef: null });
    expect(ensureCurrentStage()).toBeNull();
  });

  it('returns the existing stage without writing when one matches', () => {
    getScenarioDetails.mockReturnValue({ activeSlideRef: 'slide-1' });
    seed('run', {
      stages: [{ slideRef: 'slide-1', isComplete: true }]
    });
    const set = vi.spyOn(getCache('run'), 'set');

    expect(ensureCurrentStage()).toEqual({ slideRef: 'slide-1', isComplete: true });
    expect(set).not.toHaveBeenCalled();
  });

  it('creates a new stage and writes it to the run cache (set) in edit mode', () => {
    getScenarioDetails.mockReturnValue({ activeSlideRef: 'slide-1' });
    seed('blocks', [
      { ref: 'b-1', slideRef: 'slide-1', blockType: 'TEXT' }
    ]);

    const stage = ensureCurrentStage();

    expect(stage.slideRef).toBe('slide-1');
    expect(stage.isComplete).toBe(false);
    expect(stage.blocksByRef).toEqual({ 'b-1': {} });
    expect(getCache('run').data.stages).toHaveLength(1);
    expect(getCache('run').data.stages[0].slideRef).toBe('slide-1');
  });

  it('writes the new stage via mutate in play mode', () => {
    setPlayPathname();
    getScenarioDetails.mockReturnValue({ activeSlideRef: 'slide-1' });

    const mutate = vi.spyOn(getCache('run'), 'mutate');
    ensureCurrentStage();

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({
          stages: expect.arrayContaining([
            expect.objectContaining({ slideRef: 'slide-1' })
          ])
        }),
        options: { method: 'put' }
      }),
      undefined
    );
  });
});
