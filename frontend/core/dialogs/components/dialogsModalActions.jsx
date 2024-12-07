import React from 'react';
import map from 'lodash/map';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Button from '~/uikit/buttons/components/button';

const DialogsModalActions = ({
  actions,
  modalData,
  onActionClicked
}) => {

  if (actions && actions.length > 0) {
    return (
      <div className="border-t border-lm-1 flex justify-end items-center p-4 dark:border-dm-0">
        {map(actions, (action, index) => {
          let isDisabled = false;
          if (action.getIsDisabled) {
            isDisabled = action.getIsDisabled({ modalData });
          }
          const Component = (index === 0 && actions.length > 1) ? FlatButton : Button;
          return (
            <Component
              className="mr-4"
              key={action.type}
              {...action}
              isDisabled={isDisabled}
              onClick={() => {
                onActionClicked(action.type);
              }}
            />
          );
        })}
      </div>
    );
  }
};

export default DialogsModalActions;