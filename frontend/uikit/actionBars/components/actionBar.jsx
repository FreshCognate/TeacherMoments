import React from 'react';
import Search from '~/uikit/search/components/search';
import Pagination from '~/uikit/pagination/components/pagination';
import Button from '~/uikit/buttons/components/button';
import map from 'lodash/map';
import Syncing from '~/uikit/loaders/components/syncing';

const ActionBar = ({
  actions,
  searchValue,
  currentPage,
  totalPages,
  hasSearch,
  hasPagination,
  isSyncing,
  isLoading,
  shouldAutoFocus,
  onSearchValueChange,
  onActionClicked,
  onPaginationClicked
}) => {
  return (
    <div className="relative p-2">
      <div className="flex items-center">
        <div className="flex-1">
          {hasSearch && (
            <Search shouldAutoFocus={shouldAutoFocus} value={searchValue} onChange={onSearchValueChange} />
          )}
        </div>
        <div className="flex-1 flex justify-center items-center">
          {hasPagination && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onClick={onPaginationClicked}
            />
          )}
        </div>
        <div className="flex-1 flex justify-end items-center">
          {map(actions, (action) => {
            let isDisabled = false;
            if (action.getIsDisabled) {
              isDisabled = action.getIsDisabled();
            }
            return (
              <Button
                key={action.action}
                {...action}
                isDisabled={isDisabled}
                onClick={() => onActionClicked({ action: action.action })}
              />
            );
          })}
        </div>
      </div>
      <Syncing isSyncing={isSyncing || isLoading} />
    </div>
  );
};

export default ActionBar;