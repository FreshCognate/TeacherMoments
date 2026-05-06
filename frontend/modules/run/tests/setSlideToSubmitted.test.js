import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../helpers/getScenarioDetails', () => ({
  default: vi.fn(() => ({ activeSlideRef: 'ref-1' }))
}));

import setSlideToSubmitted from '../helpers/setSlideToSubmitted';
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

describe('setSlideToSubmitted', () => {
  const originalUrl = window.location.href;

  beforeEach(() => {
    seedRun({ stages: [{ slideRef: 'ref-1', isSubmitted: false }] });
    setEditorPathname();
  });

  afterEach(() => {
    window.history.replaceState({}, '', originalUrl);
  });

  it('marks the active stage as submitted in edit mode', () => {
    setSlideToSubmitted();
    expect(getCache('run').data.stages[0].isSubmitted).toBe(true);
  });

  it('does nothing when the stage is already submitted', () => {
    seedRun({ stages: [{ slideRef: 'ref-1', isSubmitted: true, marker: 'preserved' }] });
    const mutate = vi.spyOn(getCache('run'), 'mutate');

    setSlideToSubmitted();

    expect(mutate).not.toHaveBeenCalled();
    expect(getCache('run').data.stages[0].marker).toBe('preserved');
  });

  it('mutates the run cache via PUT in play mode', () => {
    setPlayPathname();
    const mutate = vi.spyOn(getCache('run'), 'mutate');

    setSlideToSubmitted();

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({
          stages: expect.arrayContaining([
            expect.objectContaining({ slideRef: 'ref-1', isSubmitted: true })
          ])
        }),
        options: { method: 'put' }
      }),
      undefined
    );
  });
});
