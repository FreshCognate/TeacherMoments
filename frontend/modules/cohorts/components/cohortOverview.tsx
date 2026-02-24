import React from 'react';
import { Cohort, Invite } from '../cohorts.types';
import Title from '~/uikit/content/components/title';
import CohortParticipantScenariosContainer from '../containers/cohortParticipantScenariosContainer';
import CohortCompletionStatsContainer from '../containers/cohortCompletionStatsContainer';
import canUserEditCohort from '~/modules/authentication/helpers/canUserEditCohort';
import getCache from '~/core/cache/helpers/getCache';

const CohortOverview = ({
  cohort,
}: {
  cohort: Cohort,
}) => {
  const isCohortEditor = canUserEditCohort(getCache("cohort").data);
  return (
    <div className="py-4">
      <div>
        <Title title={`Cohort: ${cohort.name}`} />
      </div>
      {isCohortEditor && (
        <div>
          <CohortCompletionStatsContainer />
        </div>
      )}
      <div>
        <CohortParticipantScenariosContainer />
      </div>
    </div>
  );
};

export default CohortOverview;