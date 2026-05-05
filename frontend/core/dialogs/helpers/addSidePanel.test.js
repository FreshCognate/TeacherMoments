import { describe, it, expect, vi, beforeEach } from 'vitest';
import addSidePanel from './addSidePanel.js';
import { createCache, getCache, resetCache } from '~/core/cache/helpers/cacheManager';

describe('addSidePanel', () => {
  beforeEach(() => {
    resetCache('dialogs');
    createCache({
      key: 'dialogs',
      cache: { getInitialData: () => ({}) },
      container: { props: {} }
    });
  });

  it('opens the side panel by setting isSidePanelOpen and sidePanel on the dialogs cache', () => {
    const sidePanel = { size: 'lg' };
    addSidePanel(sidePanel);

    expect(getCache('dialogs').data.isSidePanelOpen).toBe(true);
    expect(getCache('dialogs').data.sidePanel).toBe(sidePanel);
  });

  it('attaches a triggerClose that closes the side panel and fires callback("ACTION", { type: "CLOSE" })', () => {
    const callback = vi.fn();
    const sidePanel = { size: 'lg' };

    addSidePanel(sidePanel, callback);

    sidePanel.triggerClose('x');

    expect(getCache('dialogs').data.isSidePanelOpen).toBe(false);
    expect(getCache('dialogs').data.sidePanel).toBeNull();
    expect(callback).toHaveBeenCalledWith('ACTION', { type: 'CLOSE' });
  });
});
