import React from 'react';
import { Invite } from '../cohorts.types';
import Title from '~/uikit/content/components/title';
import ShareLink from '~/uikit/share/components/shareLink';
import getCohortInviteLink from '../helpers/getCohortInviteLink';

const CohortOverview = ({
  cohortId,
  activeInvite
}: {
  cohortId: string,
  activeInvite: Invite | undefined
}) => {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="p-4 ">
        <Title title="Invite link" className="mb-2" />
        {(activeInvite) && (
          <ShareLink
            shareLink={getCohortInviteLink({ cohortId: cohortId, invite: activeInvite })}
          />
        )}
      </div>
    </div>
  );
};

export default CohortOverview;