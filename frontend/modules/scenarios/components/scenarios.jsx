import React from 'react';
import Button from '~/uikit/buttons/components/button';
import map from 'lodash/map';
import { Link } from 'react-router';

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
              <Link to={`/scenarios/${scenario._id}/edit`}>
                Edit
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Scenarios;