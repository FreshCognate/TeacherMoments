import React from 'react';
import TriggersEditorEvent from './triggersEditorEvent';
import Button from '~/uikit/buttons/components/button';
import getTriggerDescription from '../helpers/getTriggerDescription';
import map from 'lodash/map';
import TriggerItem from './triggerItem';

const TriggersEditor = ({
  triggers,
  eventDescription,
  onAddTriggerClicked,
  onEditTriggerClicked,
  onDeleteTriggerClicked,
  onSortUpClicked,
  onSortDownClicked
}) => {
  return (
    <div>

      <TriggersEditorEvent eventDescription={eventDescription} />
      <div>
        {map(triggers, (trigger, index) => {
          const isLastTrigger = index === triggers.length - 1
          return (
            <div
              key={trigger._id}
              className="relative mx-4"
            >
              <TriggerItem
                trigger={trigger}
                isLastTrigger={isLastTrigger}
                onEditTriggerClicked={onEditTriggerClicked}
                onDeleteTriggerClicked={onDeleteTriggerClicked}
                onSortUpClicked={onSortUpClicked}
                onSortDownClicked={onSortDownClicked}
              />
              <div className="border-x-2 border-lm-2 dark:border-dm-2 h-10 relative w-0.5 top-full left-1/2 -translate-x-1/2"></div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center">
        <Button color="primary" text="Add trigger" icon="trigger" onClick={onAddTriggerClicked} />
      </div>

    </div>
  );
};

export default TriggersEditor;