import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Icon from '~/uikit/icons/components/icon';

const TriggerDisplay = ({
  eventDescription,
  triggersCount,
  onOpenTriggerPanelClicked
}) => {
  return (
    <div className="bg-lm-2 dark:bg-dm-2 text-xs rounded flex items-center overflow-auto">
      <div className="bg-lm-2 dark:bg-dm-3 p-4 mr-2 border-r border-lm-3 dark:border-dm-3">
        <Icon icon="trigger" size="12" />
      </div>
      <div>
        <FlatButton
          text={`${eventDescription}: ${triggersCount} trigger${triggersCount === 1 ? '' : 's'}`}
          size="sm"
          color="primary"
          onClick={onOpenTriggerPanelClicked}
        />
      </div>
    </div>
  );
};

export default TriggerDisplay;