import { describe, it, expect, vi, beforeEach } from 'vitest';
import addModal from './addModal.ts';
import {
  createCache,
  getCache,
  resetCache
} from '~/core/cache/helpers/cacheManager';

const seedCache = (key, initial) => {
  resetCache(key);
  createCache({
    key,
    cache: { getInitialData: () => initial },
    container: { props: {} }
  });
};

const seedAll = () => {
  seedCache('modal', { existing: 'value' });
  seedCache('dialogs', {});
  seedCache('dialogProgressItems', [
    { _id: 'preexisting', text: 'old', isComplete: true }
  ]);
};

describe('addModal', () => {
  beforeEach(() => {
    seedAll();
  });

  it('opens the modal by setting isModalOpen and modal on the dialogs cache', () => {
    const modal = { type: 'dialog', title: 'Hello' };
    addModal(modal);

    expect(getCache('dialogs').data.isModalOpen).toBe(true);
    expect(getCache('dialogs').data.modal).toBe(modal);
  });

  it('replaces the modal cache with modal.model (or empty object when not provided)', () => {
    addModal({ type: 'dialog' });
    expect(getCache('modal').data).toEqual({});

    seedAll();
    addModal({ type: 'dialog', model: { foo: 'bar' } });
    expect(getCache('modal').data).toEqual({ foo: 'bar' });
  });

  it('clears the dialogProgressItems cache to an empty array', () => {
    addModal({ type: 'dialog' });
    expect(getCache('dialogProgressItems').data).toEqual([]);
  });

  it('attaches a triggerAction to the modal that closes it and fires the callback with ACTION', () => {
    const callback = vi.fn();
    const modal = { type: 'dialog', model: { value: 1 } };

    addModal(modal, callback);
    callback.mockClear();

    modal.triggerAction('CONFIRM');

    expect(getCache('dialogs').data.isModalOpen).toBe(false);
    expect(getCache('dialogs').data.modal).toBeNull();
    expect(callback).toHaveBeenCalledWith('ACTION', { type: 'CONFIRM', modal: { value: 1 } });
  });

  it('invokes the callback with INIT and helpers (removeModal, addProgressItem, updateProgressItem)', () => {
    const callback = vi.fn();
    addModal({ type: 'dialog' }, callback);

    expect(callback).toHaveBeenCalledTimes(1);
    const [event, payload] = callback.mock.calls[0];
    expect(event).toBe('INIT');
    expect(typeof payload.removeModal).toBe('function');
    expect(typeof payload.addProgressItem).toBe('function');
    expect(typeof payload.updateProgressItem).toBe('function');
  });

  it('removeModal closes the modal without firing a separate ACTION callback', () => {
    const callback = vi.fn();
    addModal({ type: 'dialog' }, callback);
    const { removeModal } = callback.mock.calls[0][1];
    callback.mockClear();

    removeModal();

    expect(getCache('dialogs').data.isModalOpen).toBe(false);
    expect(callback).not.toHaveBeenCalled();
  });

  it('addProgressItem appends an item with a unique id and returns it', () => {
    const callback = vi.fn();
    addModal({ type: 'dialog' }, callback);
    const { addProgressItem } = callback.mock.calls[0][1];

    const id1 = addProgressItem({ text: 'Step 1' });
    const id2 = addProgressItem({ text: 'Step 2', isComplete: true });

    const items = getCache('dialogProgressItems').data;
    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({ _id: id1, text: 'Step 1' });
    expect(items[1]).toMatchObject({ _id: id2, text: 'Step 2', isComplete: true });
    expect(id1).not.toBe(id2);
  });

  it('updateProgressItem extends the matching item by id', () => {
    const callback = vi.fn();
    addModal({ type: 'dialog' }, callback);
    const { addProgressItem, updateProgressItem } = callback.mock.calls[0][1];

    const id = addProgressItem({ text: 'Step 1' });
    updateProgressItem({ id, update: { isComplete: true, text: 'Step 1 done' } });

    const item = getCache('dialogProgressItems').data.find((i) => i._id === id);
    expect(item).toMatchObject({ text: 'Step 1 done', isComplete: true });
  });

  it('updateProgressItem warns when the id is not found and does not update', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const callback = vi.fn();
    addModal({ type: 'dialog' }, callback);
    const { updateProgressItem } = callback.mock.calls[0][1];

    updateProgressItem({ id: 'missing', update: { text: 'x' } });

    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

});
