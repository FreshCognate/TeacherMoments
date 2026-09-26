import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../helpers/getScenarioDetails', () => ({
  default: vi.fn(() => ({ activeSlideRef: 'ref-1' }))
}));

import getSlideFeedbackResponses from '../helpers/getSlideFeedbackResponses';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedRun = (data) => {
  resetCache('run');
  createCache({
    key: 'run',
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

describe('getSlideFeedbackResponses', () => {
  beforeEach(() => {
    seedRun({ stages: [] });
  });

  it('returns the feedbackResponses on the matching stage', () => {
    seedRun({
      stages: [
        { slideRef: 'ref-1', feedbackResponses: ['Great answer!'] }
      ]
    });
    expect(getSlideFeedbackResponses()).toEqual(['Great answer!']);
  });

  it('returns an empty array when the stage has no feedbackResponses', () => {
    seedRun({ stages: [{ slideRef: 'ref-1' }] });
    expect(getSlideFeedbackResponses()).toEqual([]);
  });

  it('returns an empty array when no stage matches the active slide', () => {
    seedRun({ stages: [{ slideRef: 'other', feedbackResponses: ['Other feedback'] }] });
    expect(getSlideFeedbackResponses()).toEqual([]);
  });
});
