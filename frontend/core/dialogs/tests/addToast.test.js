import { describe, it, expect, vi, beforeEach } from 'vitest';
import addToast from '../helpers/addToast.ts';
import { createCache, getCache, resetCache } from '~/core/cache/helpers/cacheManager';

describe('addToast', () => {
  beforeEach(() => {
    resetCache('dialogs');
    createCache({
      key: 'dialogs',
      cache: { getInitialData: () => ({ toasts: [] }) },
      container: { props: {} }
    });
  });

  it('pushes the toast onto the toasts array with a unique _id', () => {
    addToast({ title: 'Saved' });
    addToast({ title: 'Updated' });

    const toasts = getCache('dialogs').data.toasts;
    expect(toasts).toHaveLength(2);
    expect(toasts[0].title).toBe('Saved');
    expect(toasts[1].title).toBe('Updated');
    expect(toasts[0]._id).toBeDefined();
    expect(toasts[1]._id).toBeDefined();
    expect(toasts[0]._id).not.toBe(toasts[1]._id);
  });

  it('invokes the callback with INIT and helpers (removeToast, updateToast)', () => {
    const callback = vi.fn();
    addToast({ title: 'Hello' }, callback);

    expect(callback).toHaveBeenCalledTimes(1);
    const [event, payload] = callback.mock.calls[0];
    expect(event).toBe('INIT');
    expect(typeof payload.removeToast).toBe('function');
    expect(typeof payload.updateToast).toBe('function');
  });

  it('attaches a triggerAction that removes the toast and fires the callback with ACTION', () => {
    const callback = vi.fn();
    const toast = { title: 'Saved' };

    addToast(toast, callback);
    callback.mockClear();

    toast.triggerAction('UNDO');

    expect(getCache('dialogs').data.toasts).toHaveLength(0);
    expect(callback).toHaveBeenCalledWith('ACTION', { type: 'UNDO' });
  });

  it('updateToast extends the matching toast with a new title', () => {
    const callback = vi.fn();
    addToast({ title: 'Saving...' }, callback);
    const { updateToast } = callback.mock.calls[0][1];

    updateToast({ title: 'Saved' });

    expect(getCache('dialogs').data.toasts[0].title).toBe('Saved');
  });
});
