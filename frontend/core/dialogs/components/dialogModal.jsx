import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import classnames from 'classnames';

import FlatButton from '~/uikit/buttons/components/flatButton';
import DialogsModalHeader from './dialogsModalHeader';
import DialogsModalContent from './dialogsModalContent';
import DialogsModalActions from './dialogsModalActions';
import FocusLock from 'react-focus-lock';

const DialogModal = ({
  modal,
  modalData,
  renderKey,
  onActionClicked,
  onFormUpdate,
  onCloseButtonClicked
}) => {

  const animation = {
    animate: { y: 0, opacity: 1 },
    initial: { y: 10, opacity: 0 },
    transition: { ease: [0.8, 0, 0.3, 1], duration: 0.3, delay: 0.3 },
  };

  let style = { maxWidth: modal.maxWidth || "620px", width: '90%', height: 'auto', maxHeight: '92%' };

  if (modal.isFullScreen) {
    style = { width: '98%', height: '98%', maxWidth: modal.maxWidth || "auto", maxHeight: modal.maxHeight || 'none' };
  }

  const ref = useRef(null);

  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <FocusLock>

      <div
        className={classnames('fixed z-50 w-full h-full flex justify-center items-center', modal.className)}
        tabIndex="0"
        ref={ref}
      >
        <motion.div
          className={classnames(
            'relative z-50 bg-lm-0 flex flex-col rounded-md dark:bg-dm-0',
            {
              'w-100 h-full max-w-screen-lg mx-auto': modal.isFullScreen,
            }
          )}
          animate={animation.animate}
          initial={animation.initial}
          transition={animation.transition}
          style={style}
        >
          {(modal.hasCloseButton) && (
            <FlatButton
              className="absolute right-4 top-4 z-40"
              icon="cancel"
              onClick={() => onCloseButtonClicked(null)}
            />
          )}
          <DialogsModalHeader
            title={modal.title}
            body={modal.body}
            icon={modal.icon}
          />
          <DialogsModalContent
            component={modal.component}
            schema={modal.schema}
            modalData={modalData}
            renderKey={renderKey}
            isProgressType={modal.type === 'progress'}
            isFullScreen={modal.isFullScreen}
            onFormUpdate={onFormUpdate}
            onCloseButtonClicked={onCloseButtonClicked}
            onActionClicked={onActionClicked}
          />
          {(modal.type !== 'progress') && (
            <DialogsModalActions
              actions={modal.actions}
              modalData={modalData}
              onActionClicked={onActionClicked}
            />
          )}
        </motion.div>
      </div>
    </FocusLock>
  );
};

export default DialogModal;