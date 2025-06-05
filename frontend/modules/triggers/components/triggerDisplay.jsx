import React from 'react';
import Alert from '~/uikit/alerts/components/alert';
import map from 'lodash/map';
import Body from '~/uikit/content/components/body';
import Icon from '~/uikit/icons/components/icon';
import Button from '~/uikit/buttons/components/button';
import TriggerItem from './triggerItem';

const TriggerDisplay = ({
  triggers,
  onAddTriggerClicked
}) => {
  return (
    <div className="w-full pt-4 pb-8 px-8 max-w-screen-lg mx-auto">
      <div className="flex items-center justify-between text-black/60 dark:text-white/60 mb-2">
        <div className="flex items-center">

          <Icon icon="trigger" size={16} className="mr-2" />
          <Body body="Triggers" />
        </div>
        <Alert text="Triggers are extra functionality that can happen during the transition to the next slide." type="info" />
      </div>
      <div className="bg-lm-0 dark:bg-dm-0 p-2 rounded-md">
        <div>
          {map(triggers, (trigger) => {
            return (
              <div key={trigger._id} className="mb-2">
                <TriggerItem
                  trigger={trigger}
                />
              </div>
            );
          })}
        </div>
        <div>
          <Button color="primary" text="Add trigger" icon="trigger" onClick={onAddTriggerClicked} />
        </div>
      </div>
    </div>
  );
};

export default TriggerDisplay;