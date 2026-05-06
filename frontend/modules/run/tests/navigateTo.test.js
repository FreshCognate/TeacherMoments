import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import navigateTo from '../helpers/navigateTo';
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

const buildRouter = (overrides = {}) => ({
  pathname: '/play/scenario-1',
  location: { search: '' },
  navigate: vi.fn(),
  ...overrides
});

describe('navigateTo', () => {
  const originalUrl = window.location.href;

  beforeEach(() => {
    seed('blocks', []);
    seed('run', { stages: [] });
    setEditorPathname();
  });

  afterEach(() => {
    window.history.replaceState({}, '', originalUrl);
  });

  it('appends a stage when one does not exist for the slide', async () => {
    const router = buildRouter();
    await navigateTo({ slideRef: 'ref-1', router });

    const { stages, activeSlideRef } = getCache('run').data;
    expect(activeSlideRef).toBe('ref-1');
    expect(stages).toHaveLength(1);
    expect(stages[0].slideRef).toBe('ref-1');
  });

  it('does not duplicate the stage when one already exists for the slide', async () => {
    seed('run', {
      stages: [{ slideRef: 'ref-1', existing: true }]
    });

    await navigateTo({ slideRef: 'ref-1', router: buildRouter() });

    expect(getCache('run').data.stages).toHaveLength(1);
    expect(getCache('run').data.stages[0].existing).toBe(true);
  });

  it('navigates the router to the new slide ref query parameter', async () => {
    const router = buildRouter({ pathname: '/play/scenario-1' });
    await navigateTo({ slideRef: 'ref-1', router });

    expect(router.navigate).toHaveBeenCalledWith(
      { pathname: '/play/scenario-1', search: '?slide=ref-1' },
      { replace: true }
    );
  });

  it('preserves the cohort query parameter when present', async () => {
    const router = buildRouter({
      location: { search: '?cohort=cohort-1' }
    });

    await navigateTo({ slideRef: 'ref-1', router });

    expect(router.navigate).toHaveBeenCalledWith(
      expect.objectContaining({
        search: '?slide=ref-1&cohort=cohort-1'
      }),
      { replace: true }
    );
  });

  it('mutates the run cache via PUT in play mode', async () => {
    setPlayPathname();
    const mutate = vi.spyOn(getCache('run'), 'mutate');

    await navigateTo({ slideRef: 'ref-1', router: buildRouter() });

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({
          activeSlideRef: 'ref-1'
        }),
        options: { method: 'put' }
      }),
      undefined
    );
  });
});
