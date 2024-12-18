import React from 'react';
import SelectOptions from '~/uikit/select/components/selectOptions';
import map from 'lodash/map';
import Body from '~/uikit/content/components/body';
import FlatButton from '~/uikit/buttons/components/flatButton';
import TriggerItem from './triggerItem';


const TriggersPanel = ({
  selectedType,
  slideEvent,
  blockEvent,
  triggers,
  onAddTriggerClicked,
  onEventChanged
}) => {
  console.log(triggers);

  return (
    <div className="p-2">
      <div className="flex items-center justify-between">
        <Body body={selectedType === 'BLOCK' ? "Block triggers" : "Slide triggers"} size="sm" />
        <div>
          <FlatButton icon="create" onClick={onAddTriggerClicked} />
        </div>
      </div>
      <div className="flex items-center mb-2">
        <div>
          On:
        </div>
        <SelectOptions
          value={selectedType === 'BLOCK' ? blockEvent : slideEvent}
          options={selectedType === 'BLOCK' ? [{
            value: 'ON_SHOW',
            text: 'show'
          }, {
            value: 'ON_HIDE',
            text: 'hide'
          }] : [{
            value: 'ON_ENTER',
            text: 'enter'
          }, {
            value: 'ON_EXIT',
            text: 'exit'
          }]}
          onChange={onEventChanged}
        />
      </div>
      <div>
        {map(triggers, (trigger) => {
          return (
            <TriggerItem
              key={trigger._id}
              trigger={trigger}
            />
          );
        })}
      </div>
    </div>
  );

};

export default TriggersPanel;