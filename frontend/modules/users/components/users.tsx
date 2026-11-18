import React from 'react';
import { Link } from 'react-router';
import Collection from '~/uikit/collections/components/collection';
import CollectionEmpty from '~/uikit/collections/components/collectionEmpty';
import { User } from '../users.types';

const Users = ({
  users,
  searchValue,
  currentPage,
  totalPages,
  isLoading,
  isSyncing,
  hasNoAccess,
  getItemAttributes,
  getItemActions,
  getEmptyAttributes,
  onSearchValueChange,
  onPaginationClicked,
  onItemActionClicked
}: {
  users: User[],
  searchValue: string,
  currentPage: number,
  totalPages: number,
  isLoading: boolean,
  isSyncing: boolean,
  hasNoAccess: boolean,
  getItemAttributes: (item: User) => any,
  getItemActions: (item: User) => any,
  getEmptyAttributes: () => any,
  onSearchValueChange: (searchValue: string) => void,
  onPaginationClicked: (direction: string) => void,
  onItemActionClicked: ({ itemId, action }: { itemId: string, action: string }) => void
}) => {
  if (hasNoAccess) {
    return (
      <div className="p-4">
        <CollectionEmpty
          attributes={{
            title: 'This page is for admins.',
            body: (
              <>
                Go to the <Link to="/" className="underline">dashboard</Link>.
              </>
            )
          }}
        />
      </div>
    );
  }
  return (
    <div className="p-4">
      <Collection
        items={users}
        getItemAttributes={getItemAttributes}
        getItemActions={getItemActions}
        getEmptyAttributes={getEmptyAttributes}
        searchPlaceholder="Search users..."
        searchValue={searchValue}
        currentPage={currentPage}
        totalPages={totalPages}
        hasSearch
        hasPagination
        isLoading={isLoading}
        isSyncing={isSyncing}
        shouldAutoFocus
        onSearchValueChange={onSearchValueChange}
        onPaginationClicked={onPaginationClicked}
        onItemActionClicked={onItemActionClicked}
      />
    </div>
  );
};

export default Users;
