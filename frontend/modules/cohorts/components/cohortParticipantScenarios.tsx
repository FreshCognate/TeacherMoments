import React from 'react';
import { Scenario } from '~/modules/scenarios/scenarios.types';
import map from 'lodash/map';
import getString from '~/modules/ls/helpers/getString';
import Button from '~/uikit/buttons/components/button';

const CohortParticipantScenarios = ({
  scenarios,
  onPlayScenarioClicked
}: {
  scenarios: Scenario[],
  onPlayScenarioClicked: (scenarioId: string) => void
}) => {
  return (
    <div className="grid gap-4 p-4">
      {map(scenarios, (scenario) => {
        console.log(scenario);
        return (
          <div className="p-4 bg-lm-1 dark:bg-dm-1 border border-lm-2 dark:border-dm-2 rounded-lg">
            <div>
              {scenario.name}
            </div>
            <div>
              This scenario has not been started
            </div>
            <div>
              {getString({ model: scenario, field: 'description' })}
            </div>
            <div>
              <Button icon="play" text="Run scenario" onClick={() => onPlayScenarioClicked(scenario._id)} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CohortParticipantScenarios;