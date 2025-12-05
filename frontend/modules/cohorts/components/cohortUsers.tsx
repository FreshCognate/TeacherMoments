import React from 'react';
import Title from '~/uikit/content/components/title';
import { Invite } from '../cohorts.types';
import ShareLink from '~/uikit/share/components/shareLink';
import getCohortInviteLink from '../helpers/getCohortInviteLink';

const CohortUsers = ({
  cohortId,
  activeInvite
}: { cohortId: string, activeInvite: Invite | undefined }) => {
  return (
    <div className="grid grid-cols-2 gap-10 px-10 py-4">
      <div className="bg-lm-1 dark:bg-dm-1 p-4 dark:border-dm-2 rounded-md">
        <Title title="Cohort users" className="mb-2" />

      </div>
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

export default CohortUsers;