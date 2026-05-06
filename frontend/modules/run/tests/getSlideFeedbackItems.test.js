import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../helpers/getScenarioDetails', () => ({
  default: vi.fn(() => ({ activeSlideRef: 'ref-1' }))
}));

import getSlideFeedbackItems from '../helpers/getSlideFeedbackItems';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedRun = (data) => {
  resetCache('run');
  createCache({
    key: 'run',
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

describe('getSlideFeedbackItems', () => {
  beforeEach(() => {
    seedRun({ stages: [] });
  });

  it('returns the feedbackItems on the matching stage', () => {
    seedRun({
      stages: [
        { slideRef: 'ref-1', feedbackItems: [{ id: 'fb-1' }] }
      ]
    });
    expect(getSlideFeedbackItems()).toEqual([{ id: 'fb-1' }]);
  });

  it('returns an empty array when the stage has no feedbackItems', () => {
    seedRun({ stages: [{ slideRef: 'ref-1' }] });
    expect(getSlideFeedbackItems()).toEqual([]);
  });

  it('returns an empty array when no stage matches the active slide', () => {
    seedRun({ stages: [{ slideRef: 'other', feedbackItems: [{ id: 'fb-x' }] }] });
    expect(getSlideFeedbackItems()).toEqual([]);
  });
});
