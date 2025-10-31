import React from 'react';
import Search from '~/uikit/search/components/search';
import Pagination from '~/uikit/pagination/components/pagination';
import Button from '~/uikit/buttons/components/button';
import map from 'lodash/map';
import Syncing from '~/uikit/loaders/components/syncing';
import Toggle from '~/uikit/toggles/components/toggle';

import { ActionBarProps } from '../actionBars.types';

const ActionBar = ({
  actions,
  searchValue,
  searchPlaceholder,
  currentPage,
  totalPages,
  filter,
  filters,
  sortBy,
  sortByOptions,
  hasSearch,
  hasPagination,
  hasFilters,
  hasSortBy,
  isSyncing,
  isLoading,
  shouldAutoFocus,
  onSearchValueChange,
  onActionClicked,
  onPaginationClicked,
  onFiltersChanged,
  onSortByChanged
}: ActionBarProps) => {
  return (
    <div className="relative py-2">
      <div className="flex items-center">
        <div className="flex-1 flex items-center">
          {hasSearch && (
            <Search
              shouldAutoFocus={shouldAutoFocus}
              value={searchValue}
              placeholder={searchPlaceholder}
              onChange={onSearchValueChange}
            />
          )}
          {(hasFilters) && (
            <div className="ml-4 flex items-center">
              <Toggle
                value={filter}
                options={filters}
                size="sm"
                onClick={onFiltersChanged}
              />
            </div>
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
          {(hasSortBy) && (
            <div className="flex items-center">
              <Toggle
                value={sortBy}
                options={sortByOptions}
                size="sm"
                onClick={onSortByChanged}
              />
            </div>
          )}
          {map(actions, (action: Action) => {
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