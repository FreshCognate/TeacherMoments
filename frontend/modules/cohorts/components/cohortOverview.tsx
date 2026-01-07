import React from 'react';
import { Cohort, Invite } from '../cohorts.types';
import Title from '~/uikit/content/components/title';
import CohortParticipantScenariosContainer from '../containers/cohortParticipantScenariosContainer';

const CohortOverview = ({
  cohort,
  activeInvite,
  isEditor,
}: {
  cohort: Cohort,
  activeInvite: Invite | undefined,
  isEditor: boolean
}) => {
  return (
    <div className="p-4">
      <div>
        <Title title={`Cohort: ${cohort.name}`} />
      </div>
      <div>
        <CohortParticipantScenariosContainer />
      </div>
    </div>
  );
};

export default CohortOverview;