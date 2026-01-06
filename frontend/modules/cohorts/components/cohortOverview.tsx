import React from 'react';
import { Invite } from '../cohorts.types';
import Title from '~/uikit/content/components/title';
import ShareLink from '~/uikit/share/components/shareLink';
import getCohortInviteLink from '../helpers/getCohortInviteLink';
import CohortParticipantScenariosContainer from '../containers/cohortParticipantScenariosContainer';

const CohortOverview = ({
  cohortId,
  activeInvite,
  isEditor,
}: {
  cohortId: string,
  activeInvite: Invite | undefined,
  isEditor: boolean
}) => {
  return (
    <div className="">
      {(isEditor) && (
        <div className="p-4 ">
          <Title title="Invite link" className="mb-2" />
          {(activeInvite) && (
            <ShareLink
              shareLink={getCohortInviteLink({ cohortId: cohortId, invite: activeInvite })}
            />
          )}
        </div>
      )}
      <div>
        <CohortParticipantScenariosContainer />
      </div>
    </div>
  );
};

export default CohortOverview;