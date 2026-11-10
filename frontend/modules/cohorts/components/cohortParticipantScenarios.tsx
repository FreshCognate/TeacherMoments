import React from 'react';
import { Scenario } from '~/modules/scenarios/scenarios.types';
import map from 'lodash/map';
import find from 'lodash/find';
import CohortParticipantScenariosItem from './cohortParticipantScenariosItem';
import CollectionEmpty from '~/uikit/collections/components/collectionEmpty';
import canUserEditCohort from '~/modules/authentication/helpers/canUserEditCohort';
import getCache from '~/core/cache/helpers/getCache';

const CohortParticipantScenarios = ({
  scenarios,
  runs,
  scenarioCompletions,
  totalUsers,
  isLoading,
  onPlayScenarioClicked,
  onViewScenarioResponseClicked
}: {
  scenarios: Scenario[],
  runs: any,
  scenarioCompletions: { scenarioId: string, completedCount: number }[],
  totalUsers: number,
  isLoading?: boolean,
  onPlayScenarioClicked: (scenarioId: string) => void,
  onViewScenarioResponseClicked: (scenarioId: string) => void
}) => {
  if (!isLoading && (!scenarios || scenarios.length === 0)) {
    const isCohortEditor = canUserEditCohort(getCache("cohort").data);
    return (
      <div className="py-4">
        <CollectionEmpty
          attributes={isCohortEditor ? {
            title: 'No scenarios in this cohort yet.',
            body: 'Add some on the Scenarios tab.'
          } : {
            title: 'No scenarios here yet.',
            body: 'Your facilitator will add them.'
          }}
        />
      </div>
    );
  }
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