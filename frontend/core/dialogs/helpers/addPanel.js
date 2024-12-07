import getCache from '~/core/cache/helpers/getCache';

export default (panel, callback) => {

  const dialogsCache = getCache('dialogs');
  dialogsCache.set({
    isPanelOpen: true,
    panel,
  });

  panel.triggerClose = (type) => {
    dialogsCache.set({
      panel: null,
      isPanelOpen: false,
    });
    if (callback) {
      callback('ACTION', { type: 'CLOSE' });
    }
  };
};