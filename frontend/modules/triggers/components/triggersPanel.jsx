import React from 'react';
import SelectOptions from '~/uikit/select/components/selectOptions';

const TriggersPanel = ({
  selectedType,
  slideEvent,
}) => {
  if (selectedType === 'SLIDE') {
    return (
      <div className="p-2">
        <div>Slide triggers</div>
        <div className="flex items-center">
          <div>
            On:
          </div>
          <SelectOptions
            value={slideEvent}
            options={[{
              value: 'ON_INIT',
              text: 'init'
            }]}
          />
        </div>
        <div>

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