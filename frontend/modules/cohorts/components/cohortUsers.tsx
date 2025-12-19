import React from 'react';
import Title from '~/uikit/content/components/title';
import { Invite } from '../cohorts.types';
import ShareLink from '~/uikit/share/components/shareLink';
import getCohortInviteLink from '../helpers/getCohortInviteLink';
import Button from '~/uikit/buttons/components/button';
import { User } from '~/modules/users/users.types';
import Collection from '~/uikit/collections/components/collection';

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
  onCreateInviteLinkClicked: () => void,
  onSearchValueChange: (searchValue: string) => void,
  onPaginationClicked: (action: string) => void,
  onItemActionClicked: ({ itemId, action }: { itemId: string, action: string }) => void
}) => {
  return (
    <div className="grid grid-cols-2 gap-10 px-10 py-4">
      <div className="bg-lm-1 dark:bg-dm-1 p-4 dark:border-dm-2 rounded-md">
        <Title title="Cohort users" className="mb-2" />
        <Collection
          items={users}
          getItemActions={getItemActions}
          getItemAttributes={getItemAttributes}
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