import React from 'react';
import map from 'lodash/map';
import Title from '~/uikit/content/components/title';

const AddTrigger = ({
  triggers,
  onAddTriggerClicked
}) => {
  return (
    <div>
      {map(triggers, (trigger) => {
        return (
          <div
            key={trigger.value}
            className="bg-lm-0 dark:bg-dm-0 border-t border-lm-1 dark:border-dm-1 p-4 cursor-pointer hover:bg-lm-1 dark:hover:bg-dm-1 transition-colors"
            onClick={() => onAddTriggerClicked(trigger.value)}
          >
            <Title
              title={trigger.text}
              element="h4"
            />
          </div>
        );
      })}
    </div>
  );
};

export default AddTrigger;