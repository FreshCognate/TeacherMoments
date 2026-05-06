import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../helpers/getScenarioDetails', () => ({
  default: vi.fn(() => ({ activeSlideRef: 'ref-1' }))
}));

import setSlideTrigger from '../helpers/setSlideTrigger';
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

describe('setSlideTrigger', () => {
  const originalUrl = window.location.href;

  beforeEach(() => {
    seedRun({ stages: [{ slideRef: 'ref-1' }] });
    setEditorPathname();
  });

  afterEach(() => {
    window.history.replaceState({}, '', originalUrl);
  });

  it('initialises triggersByRef and stores the items in edit mode', () => {
    setSlideTrigger({ triggerRef: 'trig-1', triggerItems: [{ id: 'item-1' }] });
    expect(getCache('run').data.stages[0].triggersByRef).toEqual({
      'trig-1': [{ id: 'item-1' }]
    });
  });

  it('preserves existing triggers and adds the new one', () => {
    seedRun({
      stages: [{
        slideRef: 'ref-1',
        triggersByRef: { existing: [{ id: 'item-0' }] }
      }]
    });

    setSlideTrigger({ triggerRef: 'trig-1', triggerItems: [{ id: 'item-1' }] });

    expect(getCache('run').data.stages[0].triggersByRef).toEqual({
      existing: [{ id: 'item-0' }],
      'trig-1': [{ id: 'item-1' }]
    });
  });

  it('mutates the run cache via PUT in play mode', () => {
    setPlayPathname();
    const mutate = vi.spyOn(getCache('run'), 'mutate');

    setSlideTrigger({ triggerRef: 'trig-1', triggerItems: [{ id: 'item-1' }] });

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({
          stages: expect.arrayContaining([
            expect.objectContaining({
              slideRef: 'ref-1',
              triggersByRef: { 'trig-1': [{ id: 'item-1' }] }
            })
          ])
        }),
        options: { method: 'put' }
      }),
      undefined
    );
  });
});
