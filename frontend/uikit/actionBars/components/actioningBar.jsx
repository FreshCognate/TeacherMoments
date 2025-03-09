import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Body from '~/uikit/content/components/body';
import Icon from '~/uikit/icons/components/icon';
import Loading from '~/uikit/loaders/components/loading';
import getActioningIcon from '../helpers/getActioningIcon';

const ActioningBar = ({
  isCreatingFromAction,
  actionType,
  actionElement,
  onCancelActioningClicked
}) => {
  return (
    <div className="text-white bg-blue-500 fixed w-full top-0 z-50 flex items-center justify-between px-4 py-4" style={{ top: '68px' }}>
      <div className="flex items-center">
        <Icon icon={getActioningIcon(actionType)} size={12} className="mr-2" /><Body body={`Pick a place to ${actionType} the ${actionElement} to`} size="sm" />
      </div>
      <div>
        {(isCreatingFromAction) && (
          <Loading text="Creating..." size="sm" />
        )}
        {(!isCreatingFromAction) && (
          <FlatButton text="Cancel" onClick={onCancelActioningClicked} />
        )}
      </div>
    </div>
  );
};

export default ActioningBar;