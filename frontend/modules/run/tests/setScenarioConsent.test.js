import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import setScenarioConsent from '../helpers/setScenarioConsent';
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

describe('setScenarioConsent', () => {
  const originalUrl = window.location.href;

  beforeEach(() => {
    seedRun({});
    setEditorPathname();
  });

  afterEach(() => {
    window.history.replaceState({}, '', originalUrl);
  });

  it('sets isConsentAcknowledged and hasGivenConsent on the run cache in edit mode', () => {
    setScenarioConsent(true);
    expect(getCache('run').data).toEqual({
      isConsentAcknowledged: true,
      hasGivenConsent: true
    });
  });

  it('passes hasGivenConsent through as-is', () => {
    setScenarioConsent(false);
    expect(getCache('run').data.hasGivenConsent).toBe(false);
  });

  it('mutates the run cache via PUT in play mode', () => {
    setPlayPathname();
    const mutate = vi.spyOn(getCache('run'), 'mutate');

    setScenarioConsent(true);

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        update: { isConsentAcknowledged: true, hasGivenConsent: true },
        options: { method: 'put' }
      }),
      undefined
    );
  });
});
