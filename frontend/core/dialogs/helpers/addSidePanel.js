import getCache from '~/core/cache/helpers/getCache';

export default (sidePanel, callback) => {

  const dialogsCache = getCache('dialogs');
  dialogsCache.set({
    isSidePanelOpen: true,
    sidePanel,
  });


  sidePanel.triggerClose = (type) => {
    dialogsCache.set({
      sidePanel: null,
      isSidePanelOpen: false,
    });
    if (callback) {
      callback('ACTION', { type: 'CLOSE' });
    }
  };

};