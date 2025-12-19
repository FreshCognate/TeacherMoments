import React from 'react';
import Title from '~/uikit/content/components/title';
import { Invite } from '../cohorts.types';
import ShareLink from '~/uikit/share/components/shareLink';
import getCohortInviteLink from '../helpers/getCohortInviteLink';
import Button from '~/uikit/buttons/components/button';

const CohortUsers = ({
  cohortId,
  activeInvite,
  isCreatingInviteLink,
  onCreateInviteLinkClicked
}: {
  cohortId: string,
  activeInvite: Invite | undefined,
  isCreatingInviteLink: boolean,
  onCreateInviteLinkClicked: () => void
}) => {
  return (
    <div className="grid grid-cols-2 gap-10 px-10 py-4">
      <div className="bg-lm-1 dark:bg-dm-1 p-4 dark:border-dm-2 rounded-md">
        <Title title="Cohort users" className="mb-2" />

      </div>
      <div className="p-4 flex items-center">
        <Title title="Invite link" className="mb-2" />
        {(activeInvite) && (
          <ShareLink
            shareLink={getCohortInviteLink({ cohortId: cohortId, invite: activeInvite })}
          />
        )}
        {(!activeInvite) && (
          <Button text="Create an invite link" isDisabled={isCreatingInviteLink} onClick={onCreateInviteLinkClicked} />
        )}
      </div>
    </div>
  );
};

export default CohortUsers;