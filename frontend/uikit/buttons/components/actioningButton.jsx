import React from 'react';
import getActioningIcon from '~/uikit/actionBars/helpers/getActioningIcon';
import FlatButton from './flatButton';

const ActioningButton = ({
  actionType,
  position,
  onActionClicked
}) => {
  return (
    <FlatButton icon={getActioningIcon(actionType)} isCircular color="primary" onClick={() => onActionClicked(position)} />
  );
};

export default ActioningButton;