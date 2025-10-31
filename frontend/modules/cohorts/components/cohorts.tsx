import React from 'react';
import { ActionBarProps } from '~/uikit/actionBars/actionBars.types';
import ActionBar from '~/uikit/actionBars/components/actionBar';

const Cohorts = ({
  searchValue,
  currentPage,
  totalPages,
  filter,
  filters,
  sortBy,
  sortByOptions,
  isSyncing,
  isLoading,
  onSearchValueChange,
  onPaginationClicked,
  onFiltersChanged,
  onSortByChanged
}: ActionBarProps) => {
  return (
    <div>
      <div className="bg-lm-0 dark:bg-dm-0 px-4 border-b border-b-lm-3 dark:border-b-dm-2">
        <ActionBar
          searchValue={searchValue}
          searchPlaceholder="Search cohorts..."
          currentPage={currentPage}
          totalPages={totalPages}
          filter={filter}
          filters={filters}
          sortBy={sortBy}
          sortByOptions={sortByOptions}
          hasSearch
          hasPagination
          hasFilters
          hasSortBy
          isSyncing={isSyncing}
          isLoading={isLoading}
          shouldAutoFocus
          onSearchValueChange={onSearchValueChange}
          onPaginationClicked={onPaginationClicked}
          onFiltersChanged={onFiltersChanged}
          onSortByChanged={onSortByChanged}
        />
      </div></div>
  );
};

export default Cohorts;