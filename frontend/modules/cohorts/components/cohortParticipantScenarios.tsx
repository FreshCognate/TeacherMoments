import React from 'react';
import { Scenario } from '~/modules/scenarios/scenarios.types';
import map from 'lodash/map';
import find from 'lodash/find';
import CohortParticipantScenariosItem from './cohortParticipantScenariosItem';

const CohortParticipantScenarios = ({
  scenarios,
  runs,
  scenarioCompletions,
  totalUsers,
  onPlayScenarioClicked,
  onViewScenarioResponseClicked
}: {
  scenarios: Scenario[],
  runs: any,
  scenarioCompletions: { scenarioId: string, completedCount: number }[],
  totalUsers: number,
  onPlayScenarioClicked: (scenarioId: string) => void,
  onViewScenarioResponseClicked: (scenarioId: string) => void
}) => {
  return (
    <div className="grid gap-4 py-4">
      {map(scenarios, (scenario) => {
        const completion = find(scenarioCompletions, { scenarioId: scenario._id });
        return (
          <CohortParticipantScenariosItem
            key={scenario._id}
            scenario={scenario}
            run={runs[scenario._id]}
            completedCount={completion?.completedCount}
            totalUsers={totalUsers}
            onPlayScenarioClicked={onPlayScenarioClicked}
            onViewScenarioResponseClicked={onViewScenarioResponseClicked}
          />
        );
      })}
    </div>
  );
};

export default CohortParticipantScenarios;