import React from 'react';
import SelectOptions from '~/uikit/select/components/selectOptions';
import map from 'lodash/map';
import Body from '~/uikit/content/components/body';
import FlatButton from '~/uikit/buttons/components/flatButton';

const TriggersPanel = ({
  selectedType,
  slideEvent,
  triggers,
  onAddTriggerClicked
}) => {
  console.log(triggers);
  if (selectedType === 'SLIDE') {
    return (
      <div className="p-2">
        <div className="flex items-center justify-between">
          <Body body="Slide triggers" size="sm" />
          <div>
            <FlatButton icon="create" onClick={onAddTriggerClicked} />
          </div>
        </div>
        <div className="flex items-center">
          <div>
            On:
          </div>
          <SelectOptions
            value={slideEvent}
            options={[{
              value: 'ON_ENTER',
              text: 'enter'
            }, {
              value: 'ON_EXIT',
              text: 'exit'
            }]}
          />
        </div>
        <div>
          {map(triggers, (trigger) => {
            return (
              <div key={trigger._id}>
                {trigger.event}
              </div>
            );
          })}
        </div>
      </div>
    );
  } else if (selectedType === 'BLOCK') {
    return (
      <div>
        <div>Block triggers</div>
      </div>
    );
  }
};

export default TriggersPanel;