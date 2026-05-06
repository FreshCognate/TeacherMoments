import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../helpers/getScenarioDetails', () => ({
  default: vi.fn(() => ({ activeSlideRef: 'ref-1' }))
}));

import setSlideFeedback from '../helpers/setSlideFeedback';
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

describe('setSlideFeedback', () => {
  const originalUrl = window.location.href;

  beforeEach(() => {
    seedRun({ stages: [{ slideRef: 'ref-1' }] });
    setEditorPathname();
  });

  afterEach(() => {
    window.history.replaceState({}, '', originalUrl);
  });

  it('sets feedbackItems on the active stage in edit mode', () => {
    setSlideFeedback([{ id: 'fb-1' }]);
    expect(getCache('run').data.stages[0].feedbackItems).toEqual([{ id: 'fb-1' }]);
  });

  it('mutates the run cache via PUT in play mode', () => {
    setPlayPathname();
    const mutate = vi.spyOn(getCache('run'), 'mutate');

    setSlideFeedback([{ id: 'fb-1' }]);

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({
          stages: expect.arrayContaining([
            expect.objectContaining({
              slideRef: 'ref-1',
              feedbackItems: [{ id: 'fb-1' }]
            })
          ])
        }),
        options: { method: 'put' }
      }),
      undefined
    );
  });
});
