import React from 'react';
import Body from '~/uikit/content/components/body';
import Icon from '~/uikit/icons/components/icon';

const TriggersEditorEvent = ({
  eventDescription
}) => {
  return (
    <div className="relative">
      <div className="flex items-center bg-lm-1 dark:bg-dm-1 border border-lm-2 dark:border-dm-2 w-52 mx-auto rounded text-center">
        <div className="p-4 bg-lm-2 dark:bg-dm-2">
          <Icon icon="trigger" />
        </div>
        <div className="p-2 text-center w-full">
          <Body body={eventDescription} size="sm" />
        </div>
      </div>
      <div className="border-x-2 border-lm-2 dark:border-dm-2 h-10 relative w-0.5 left-1/2 -translate-x-1/2"></div>
    </div>
  );
};

export default TriggersEditorEvent;