import getCache from '~/core/cache/helpers/getCache';
import uniqueId from 'lodash/uniqueId';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import extend from 'lodash/extend';

export default (modal: any, callback: any) => {

  const modalCache = getCache('modal');
  const dialogsCache = getCache('dialogs');
  const dialogProgressItems = getCache('dialogProgressItems');
  modalCache.set(modal.model || {});
  dialogsCache.set({
    isModalOpen: true,
    modal,
  });

  dialogProgressItems.set([]);


  modal.triggerAction = (type: string) => {
    dialogsCache.set({
      modal: null,
      isModalOpen: false
    });
    const modalCache = getCache('modal');
    if (callback) {
      callback('ACTION', { type, modal: modalCache.data });
    }
  };

  const removeModal = () => {
    dialogsCache.set({
      modal: null,
      isModalOpen: false
    });
    const dialogProgressItems = getCache('dialogProgressItems');
    dialogProgressItems.set([]);
  }

  const addProgressItem = ({ text, progress, isComplete }: { text?: string, status?: string, progress?: string, isComplete?: boolean }) => {
    const dialogProgressItems = getCache('dialogProgressItems');
    const itemId = uniqueId('dialog_progress_');
    const progressItems = cloneDeep(dialogProgressItems.data);
    progressItems.push({ _id: itemId, text, status, progress, isComplete });
    dialogProgressItems.set(progressItems);
    return itemId;
  }

  const updateProgressItem = ({ id, update }: { id: string, update: { text?: string, status?: string, progress?: string, isComplete?: boolean, link?: string } }) => {
    const dialogProgressItems = getCache('dialogProgressItems');
    const progressItems = cloneDeep(dialogProgressItems.data);
    const currentItem = find(progressItems, { _id: id });
    if (!currentItem) return console.warn(`This dialog progress item does not exist: ${id}`);
    extend(currentItem, update);
    dialogProgressItems.set(progressItems);
  }

  if (callback) {
    callback('INIT', {
      removeModal,
      addProgressItem,
      updateProgressItem
    })
  }
}