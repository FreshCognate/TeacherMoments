import React from 'react';
import getCohortScenarioStatus from '../helpers/getCohortScenarioStatus';
import getString from '~/modules/ls/helpers/getString';
import Button from '~/uikit/buttons/components/button';
import { Scenario } from '~/modules/scenarios/scenarios.types';
import { Run } from '~/modules/run/runs.types';

const CohortParticipantScenariosItem = ({
  scenario,
  run,
  onPlayScenarioClicked
}: {
  scenario: Scenario,
  run: Run,
  onPlayScenarioClicked: (scenarioId: string) => void
}) => {
  return (
    <div className="p-4 bg-lm-1 dark:bg-dm-1 border border-lm-2 dark:border-dm-2 rounded-lg">
      <div>
        {scenario.name}
      </div>
      <div>
        {getCohortScenarioStatus(run)}
      </div>
      <div>
        {getString({ model: scenario, field: 'description' })}
      </div>
      <div>
        <Button icon="play" text="Run scenario" onClick={() => onPlayScenarioClicked(scenario._id)} />
      </div>
    </div>
  );
};

export default CohortParticipantScenariosItem;