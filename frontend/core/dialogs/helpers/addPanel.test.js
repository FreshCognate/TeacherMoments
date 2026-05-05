import { describe, it, expect, vi, beforeEach } from 'vitest';
import addPanel from './addPanel.js';
import { createCache, getCache, resetCache } from '~/core/cache/helpers/cacheManager';

describe('addPanel', () => {
  beforeEach(() => {
    resetCache('dialogs');
    createCache({
      key: 'dialogs',
      cache: { getInitialData: () => ({}) },
      container: { props: {} }
    });
  });

  it('opens the panel by setting isPanelOpen and panel on the dialogs cache', () => {
    const panel = { title: 'Filters' };
    addPanel(panel);

    expect(getCache('dialogs').data.isPanelOpen).toBe(true);
    expect(getCache('dialogs').data.panel).toBe(panel);
  });

  it('attaches a triggerClose that closes the panel and fires callback("ACTION", { type: "CLOSE" })', () => {
    const callback = vi.fn();
    const panel = { title: 'Filters' };

    addPanel(panel, callback);

    panel.triggerClose('done');

    expect(getCache('dialogs').data.isPanelOpen).toBe(false);
    expect(getCache('dialogs').data.panel).toBeNull();
    expect(callback).toHaveBeenCalledWith('ACTION', { type: 'CLOSE' });
  });

  it('does not throw when no callback is provided', () => {
    const panel = { title: 'Filters' };
    addPanel(panel);

    expect(() => panel.triggerClose('x')).not.toThrow();
    expect(getCache('dialogs').data.isPanelOpen).toBe(false);
  });
});
