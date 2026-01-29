import React from 'react';
import getCohortScenarioStatus from '../helpers/getCohortScenarioStatus';
import getString from '~/modules/ls/helpers/getString';
import Button from '~/uikit/buttons/components/button';
import { Scenario } from '~/modules/scenarios/scenarios.types';
import { Run } from '~/modules/run/runs.types';
import Body from '~/uikit/content/components/body';
import Title from '~/uikit/content/components/title';
import canUserEditCohort from '~/modules/authentication/helpers/canUserEditCohort';
import getCache from '~/core/cache/helpers/getCache';

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
  const isCohortEditor = canUserEditCohort(getCache("cohort").data);
  return (
    <div className="p-4 bg-lm-0 dark:bg-dm-1 border border-lm-3 dark:border-dm-1 rounded-lg">
      <div className="font-bold text-sm text-black/90 dark:text-white/90">
        <Title title={scenario.name} />
      </div>
      <div className="text-sm text-black/60 dark:text-white/60 mb-2">
        {getCohortScenarioStatus(run)}
      </div>
      <div>
        <Body body={getString({ model: scenario, field: 'description' })} />
      </div>
      <div className="flex gap-2 mt-3">
        <Button icon="play" text="Run scenario" color="primary" onClick={() => onPlayScenarioClicked(scenario._id)} />
        {(isCohortEditor) && (
          <Button icon="responses" text="View responses" onClick={() => onViewScenarioResponseClicked(scenario._id)} />
        )}
      </div>
    </div>
  );
};

export default CohortParticipantScenariosItem;