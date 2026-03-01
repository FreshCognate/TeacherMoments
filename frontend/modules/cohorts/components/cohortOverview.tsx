import React from 'react';
import { Cohort, Invite } from '../cohorts.types';
import Title from '~/uikit/content/components/title';
import Button from '~/uikit/buttons/components/button';
import CohortParticipantScenariosContainer from '../containers/cohortParticipantScenariosContainer';
import CohortCompletionStatsContainer from '../containers/cohortCompletionStatsContainer';
import canUserEditCohort from '~/modules/authentication/helpers/canUserEditCohort';
import getCache from '~/core/cache/helpers/getCache';

const CohortOverview = ({
  cohort,
  onExportClicked,
}: {
  cohort: Cohort,
  onExportClicked: () => void,
}) => {
  const isCohortEditor = canUserEditCohort(getCache("cohort").data);
  return (
    <div className="py-4">
      <div className="flex items-center justify-between">
        <Title title={`Cohort: ${cohort.name}`} />
        {isCohortEditor && (
          <Button text="Export CSV" icon="download" onClick={onExportClicked} />
        )}
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