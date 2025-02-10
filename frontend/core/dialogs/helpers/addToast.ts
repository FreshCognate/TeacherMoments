import getCache from '~/core/cache/helpers/getCache';
import uniqueId from 'lodash/uniqueId';
import remove from 'lodash/remove';
import find from 'lodash/find';
import extend from 'lodash/extend';

export default (toast: any, callback: any) => {

  const dialogsCache = getCache('dialogs');

  toast._id = uniqueId('toast_');

  dialogsCache.data.toasts.push(toast);

  dialogsCache.set({
    toasts: dialogsCache.data.toasts
  });

  const removeToast = ({ callback, type }: { callback: any, type: any }) => {
    remove(dialogsCache.data.toasts, (toastItem: { _id: string }) => {
      return (toastItem._id === toast._id);
    });
    dialogsCache.set({
      toasts: dialogsCache.data.toasts
    });
    if (callback) {
      callback('ACTION', { type })
    }
  }

  const updateToast = ({ title }: { title: string }) => {
    const currentToast = find(dialogsCache.data.toasts, { _id: toast._id });
    let updateObject: { title?: string } = {};
    if (title) {
      updateObject.title = title;
    }
    extend(currentToast, updateObject);
    dialogsCache.set({
      toasts: dialogsCache.data.toasts
    });
  }


  toast.triggerAction = (type: string) => {
    removeToast({ type });
    if (callback) {
      callback('ACTION', { type });
    }
  };


  if (callback) {
    callback('INIT', { removeToast, updateToast })
  }

}