import React from 'react';
import DialogModalLightbox from './dialogModalLightbox';
import DialogModal from './dialogModal';
import DialogToastContainer from '../containers/dialogToastContainer';
import DialogSidePanel from './dialogSidePanel';
import map from 'lodash/map';
import DialogPanelContainer from '../containers/dialogPanelContainer';

const Dialogs = ({
  dialogs,
  modalData,
  renderKey,
  onActionClicked,
  onFormUpdate,
  onCloseButtonClicked,
  onToastActionClicked
}) => {

  return (
    <>
      {(dialogs.modal || dialogs.sidePanel || dialogs.panel) && (
        <div className="fixed z-50">
          {(dialogs.panel) && (
            <DialogPanelContainer
              panel={dialogs.panel}
            />
          )}
          {(dialogs.sidePanel) && (
            <DialogModalLightbox isSidePanel onClick={() => dialogs.sidePanel.triggerClose()}>
              <DialogSidePanel
                sidePanel={dialogs.sidePanel}
              />
            </DialogModalLightbox>
          )}
          {(dialogs.modal) && (
            <DialogModalLightbox>
              <DialogModal
                modal={dialogs.modal}
                modalData={modalData}
                renderKey={renderKey}
                onActionClicked={onActionClicked}
                onFormUpdate={onFormUpdate}
                onCloseButtonClicked={onCloseButtonClicked}
              />
            </DialogModalLightbox>
          )}
        </div>
      )}
      {(dialogs.toasts) && (
        <div className="fixed z-50" style={{ right: '16px', bottom: '16px' }}>
          {map(dialogs.toasts, (toast) => {
            return (
              <DialogToastContainer
                key={toast._id}
                toast={toast}
                onActionClicked={onToastActionClicked}
              />
            );
          })}
        </div>
      )}
    </>
  )

};

export default Dialogs;