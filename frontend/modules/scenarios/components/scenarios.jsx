import React from 'react';
import Button from '~/uikit/buttons/components/button';
import map from 'lodash/map';

const Scenarios = ({
  scenarios,
  onCreateScenarioClicked
}) => {
  return (
    <div>
      <div>
        <Button text="Create scenario" color="primary" onClick={onCreateScenarioClicked} />
      </div>
      <div>
        {map(scenarios, (scenario) => {
          return (
            <div key={scenario._id}>
              {scenario.name} - {scenario.accessType}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Scenarios;