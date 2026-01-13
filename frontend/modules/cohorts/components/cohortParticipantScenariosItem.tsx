import React from 'react';
import getCohortScenarioStatus from '../helpers/getCohortScenarioStatus';
import getString from '~/modules/ls/helpers/getString';
import Button from '~/uikit/buttons/components/button';
import { Scenario } from '~/modules/scenarios/scenarios.types';
import { Run } from '~/modules/run/runs.types';

const CohortParticipantScenariosItem = ({
  scenario,
  run,
  onPlayScenarioClicked,
  onViewScenarioResponseClicked
}: {
  scenario: Scenario,
  run: Run,
  onPlayScenarioClicked: (scenarioId: string) => void,
  onViewScenarioResponseClicked: (scenarioId: string) => void,
}) => {
  return (
    <div className="p-4 bg-lm-0 dark:bg-dm-1 border border-lm-3 dark:border-dm-1 rounded-lg">
      <div className="font-bold text-sm text-black/90 dark:text-white/90">
        {scenario.name}
      </div>
      <div className="text-sm text-black/60 dark:text-white/60">
        {getCohortScenarioStatus(run)}
      </div>
      <div>
        {getString({ model: scenario, field: 'description' })}
      </div>
      <div className="flex gap-2 mt-3">
        <Button icon="play" text="Run scenario" color="primary" onClick={() => onPlayScenarioClicked(scenario._id)} />
        <Button icon="responses" text="View responses" onClick={() => onViewScenarioResponseClicked(scenario._id)} />
      </div>
    </div>
  );
};

export default CohortParticipantScenariosItem;