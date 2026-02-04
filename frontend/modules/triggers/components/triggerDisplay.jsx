import React from 'react';
import Alert from '~/uikit/alerts/components/alert';
import map from 'lodash/map';
import Body from '~/uikit/content/components/body';
import Icon from '~/uikit/icons/components/icon';
import Button from '~/uikit/buttons/components/button';
import TriggerItemContainer from '../containers/triggerItemContainer';

const TriggerDisplay = ({
  triggers,
  onAddTriggerClicked,
  onDeleteTriggerClicked,
  onSortUpClicked,
  onSortDownClicked
}) => {
  return (
    <div className="w-full pt-4 pb-8 px-4 max-w-screen-lg mx-auto">
      <div className="flex items-center justify-between text-black/60 dark:text-white/60 mb-2">
        <Alert text="Triggers are extra functionality that can happen during the transition to the next slide." type="info" />
      </div>
      <div className=" p-2">
        <div>
          {map(triggers, (trigger, index) => {
            return (
              <div key={trigger._id} className="mb-8">
                <TriggerItemContainer
                  trigger={trigger}
                  isLastTrigger={index === triggers.length - 1}
                  onDeleteTriggerClicked={onDeleteTriggerClicked}
                  onSortUpClicked={onSortUpClicked}
                  onSortDownClicked={onSortDownClicked}
                />
              </div>
            );
          })}
        </div>
        {(triggers.length === 0) && (
          <div className="mt-8">
            <Button color="primary" text="Add trigger" icon="trigger" onClick={onAddTriggerClicked} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TriggerDisplay;