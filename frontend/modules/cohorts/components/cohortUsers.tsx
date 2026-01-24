import React from 'react';
import Title from '~/uikit/content/components/title';
import { Invite } from '../cohorts.types';
import ShareLink from '~/uikit/share/components/shareLink';
import getCohortInviteLink from '../helpers/getCohortInviteLink';
import Button from '~/uikit/buttons/components/button';
import { User } from '~/modules/users/users.types';
import Collection from '~/uikit/collections/components/collection';
import Body from '~/uikit/content/components/body';

const CohortUsers = ({
  users,
  cohortId,
  activeInvite,
  searchValue,
  currentPage,
  totalPages,
  isLoading,
  isSyncing,
  isCreatingInviteLink,
  getItemAttributes,
  getItemActions,
  getEmptyAttributes,
  onCreateInviteLinkClicked,
  onSearchValueChange,
  onPaginationClicked,
  onItemActionClicked
}: {
  users: User[],
  cohortId: string,
  activeInvite: Invite | undefined,
  searchValue: string,
  currentPage: number,
  totalPages: number,
  isLoading: boolean,
  isSyncing: boolean,
  isCreatingInviteLink: boolean,
  getItemAttributes: (item: User) => any,
  getItemActions: (item: User) => any,
  getEmptyAttributes: () => any,
  onCreateInviteLinkClicked: () => void,
  onSearchValueChange: (searchValue: string) => void,
  onPaginationClicked: (action: string) => void,
  onItemActionClicked: ({ itemId, action }: { itemId: string, action: string }) => void
}) => {
  return (
    <div className="py-4">
      <div className="mb-4">
        <Title title="Invite link" className="mb-2" />
        <Body
          body="To add users to this cohort, send them the Invite link below. Once they navigate to this invite link they will have the option to login or register via email."
          className="mb-2 text-black/60 dark:text-white/60 text-sm max-w-lg"
        />
        {(activeInvite) && (
          <ShareLink
            shareLink={getCohortInviteLink({ cohortId: cohortId, invite: activeInvite })}
          />
        )}
        {(!activeInvite) && (
          <Button text="Create an invite link" isDisabled={isCreatingInviteLink} onClick={onCreateInviteLinkClicked} />
        )}
      </div>
      <Title title="Users in this Cohort" className="mb-2" />
      <div className="bg-lm-1 dark:bg-dm-1 p-4 dark:border-dm-2 rounded-md">
        <Collection
          items={users}
          getItemActions={getItemActions}
          getItemAttributes={getItemAttributes}
          getEmptyAttributes={getEmptyAttributes}
          searchPlaceholder="Search users..."
          searchValue={searchValue}
          currentPage={currentPage}
          totalPages={totalPages}
          hasSearch
          hasPagination
          isLoading={isLoading}
          isSyncing={isSyncing}
          onSearchValueChange={onSearchValueChange}
          onPaginationClicked={onPaginationClicked}
          onItemActionClicked={onItemActionClicked}
        />
      </div>

    </div>
  );
};

export default CohortUsers;