import React from 'react';
import { Scenario } from '~/modules/scenarios/scenarios.types';
import map from 'lodash/map';
import getString from '~/modules/ls/helpers/getString';
import Button from '~/uikit/buttons/components/button';
import getCohortScenarioStatus from '../helpers/getCohortScenarioStatus';
import CohortParticipantScenariosItem from './cohortParticipantScenariosItem';

const CohortParticipantScenarios = ({
  scenarios,
  runs,
  onPlayScenarioClicked,
  onViewScenarioResponseClicked
}: {
  scenarios: Scenario[],
  runs: any,
  onPlayScenarioClicked: (scenarioId: string) => void,
  onViewScenarioResponseClicked: (scenarioId: string) => void
}) => {
  return (
    <div className="grid gap-4 py-4">
      {map(scenarios, (scenario) => {
        return (
          <CohortParticipantScenariosItem
            key={scenario._id}
            scenario={scenario}
            run={runs[scenario._id]}
            onPlayScenarioClicked={onPlayScenarioClicked}
            onViewScenarioResponseClicked={onViewScenarioResponseClicked}
          />
        );
      })}
    </div>
  );
};

export default CohortParticipantScenarios;