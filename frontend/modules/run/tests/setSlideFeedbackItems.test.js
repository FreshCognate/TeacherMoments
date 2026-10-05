import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../helpers/getScenarioDetails', () => ({
  default: vi.fn(() => ({ activeSlideRef: 'ref-1' }))
}));

import setSlideFeedbackItems from '../helpers/setSlideFeedbackItems';
import { createCache, resetCache, getCache } from '~/core/cache/helpers/cacheManager';

const seedRun = (data) => {
  resetCache('run');
  createCache({
    key: 'run',
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

const feedbackItems = [{
  blockRef: 'block-1',
  blockType: 'INPUT_PROMPT',
  conditions: [{ conditionId: 'condition-1', feedbackItemId: 'feedback-item-1', score: 1, reasoning: 'Matches' }]
}];

const setEditorPathname = () => {
  window.history.replaceState({}, '', '/scenarios/scenario-1/create');
};

const setPlayPathname = () => {
  window.history.replaceState({}, '', '/play/scenario-1');
};

describe('setSlideFeedbackItems', () => {
  const originalUrl = window.location.href;

  beforeEach(() => {
    seedRun({ stages: [{ slideRef: 'ref-1' }] });
    setEditorPathname();
  });

  afterEach(() => {
    window.history.replaceState({}, '', originalUrl);
  });

  it('sets feedbackItems on the active stage in edit mode', () => {
    setSlideFeedbackItems(feedbackItems);
    expect(getCache('run').data.stages[0].feedbackItems).toEqual(feedbackItems);
  });

  it('mutates the run cache via PUT in play mode', () => {
    setPlayPathname();
    const mutate = vi.spyOn(getCache('run'), 'mutate');

    setSlideFeedbackItems(feedbackItems);

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({
          stages: expect.arrayContaining([
            expect.objectContaining({
              slideRef: 'ref-1',
              feedbackItems
            })
          ])
        }),
        options: { method: 'put' }
      }),
      undefined
    );
  });
});
