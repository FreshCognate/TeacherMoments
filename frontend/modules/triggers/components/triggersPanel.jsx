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
  onEventChanged,
  onDeleteTriggerClicked,
  onEditTriggerClicked
}) => {
  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-2">
        <Body body={selectedType === 'BLOCK' ? "Block triggers" : "Slide triggers"} size="sm" />
        <div>
          <FlatButton icon="create" onClick={onAddTriggerClicked} />
        </div>
      </div>
      <div className="flex items-center mb-2 border border-lm-3 dark:border-dm-3 rounded px-0.5 ">
        <div className="text-sm">
          On:
        </div>
        <SelectOptions
          value={selectedType === 'BLOCK' ? blockEvent : slideEvent}
          size="sm"
          options={selectedType === 'BLOCK' ? [{
            value: 'ON_SHOW',
            text: 'show'
          }, {
            value: 'ON_HIDE',
            text: 'hide'
          }, {
            value: 'ON_COMPLETE',
            text: 'complete'
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
              onDeleteTriggerClicked={onDeleteTriggerClicked}
              onEditTriggerClicked={onEditTriggerClicked}
            />
          );
        })}
      </div>
    </div>
  );

};

export default TriggersPanel;