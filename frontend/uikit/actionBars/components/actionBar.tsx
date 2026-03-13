import React, { useState, useRef } from 'react';
import Search from '~/uikit/search/components/search';
import Pagination from '~/uikit/pagination/components/pagination';
import Button from '~/uikit/buttons/components/button';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Dropdown from '~/uikit/dropdowns/components/dropdown';
import map from 'lodash/map';
import find from 'lodash/find';
import Syncing from '~/uikit/loaders/components/syncing';
import Toggle from '~/uikit/toggles/components/toggle';
import useOnClickOutside from '~/core/app/hooks/useOnClickOutside';

import { Action, ActionBarProps } from '../actionBars.types';

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
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchOverlayRef = useRef(null);

  useOnClickOutside(searchOverlayRef, () => setIsSearchOpen(false), isSearchOpen);

  const selectedFilterText = find(filters, { value: filter })?.text || 'Filter';
  const selectedSortText = find(sortByOptions, { value: sortBy })?.text || 'Sort';

  return (
    <div className="relative bg-lm-0 dark:bg-dm-1 border border-lm-3 dark:border-dm-1 rounded-lg py-2 px-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="flex-1 flex justify-center sm:justify-start items-center">
          {hasSearch && (
            <>
              <div className="hidden lg:block">
                <Search
                  shouldAutoFocus={shouldAutoFocus}
                  value={searchValue || ''}
                  placeholder={searchPlaceholder}
                  onChange={onSearchValueChange || (() => {})}
                />
              </div>
              <div className="lg:hidden relative">
                <FlatButton
                  icon="search"
                  isCircular
                  ariaLabel="Search"
                  onClick={() => setIsSearchOpen(true)}
                />
                {searchValue && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-primary-regular rounded-full" />
                )}
              </div>
            </>
          )}
          {(hasFilters) && (
            <>
              <div className="ml-4 hidden lg:flex items-center">
                <Toggle
                  value={filter}
                  options={filters}
                  className=""
                  size="sm"
                  isDisabled={false}
                  onClick={onFiltersChanged}
                />
              </div>
              <div className="ml-4 lg:hidden">
                <Dropdown
                  placeholder={selectedFilterText}
                  position="left"
                  options={map(filters, (f) => ({ value: f.value, text: f.text }))}
                  isOpen={isFilterDropdownOpen}
                  onToggle={setIsFilterDropdownOpen}
                  onOptionClicked={(value: string | boolean) => {
                    if (onFiltersChanged) {
                      onFiltersChanged(value);
                    }
                  }}
                />
              </div>
            </>
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
        <div className="flex-1 flex justify-center sm:justify-end items-center">
          {(hasSortBy) && (
            <>
              <div className="hidden lg:flex items-center">
                <Toggle
                  value={sortBy}
                  options={sortByOptions}
                  className=""
                  size="sm"
                  isDisabled={false}
                  onClick={onSortByChanged}
                />
              </div>
              <div className="lg:hidden">
                <Dropdown
                  placeholder={selectedSortText}
                  options={map(sortByOptions, (s) => ({ value: s.value, text: s.text }))}
                  isOpen={isSortDropdownOpen}
                  onToggle={setIsSortDropdownOpen}
                  onOptionClicked={(value: string) => {
                    if (onSortByChanged) {
                      onSortByChanged(value);
                    }
                  }}
                />
              </div>
            </>
          )}
          {(actions && actions.length > 0) && (
            <div className="ml-2 flex items-center gap-x-2">
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
                    onClick={() => {
                      if (onActionClicked) {
                        onActionClicked({ action: action.action })
                      }
                    }
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
      {isSearchOpen && (
        <div
          ref={searchOverlayRef}
          className="absolute inset-0 z-10 flex items-center gap-2 bg-lm-0 dark:bg-dm-1 rounded-lg py-2 px-3"
        >
          <div className="flex-1">
            <Search
              shouldAutoFocus
              value={searchValue || ''}
              placeholder={searchPlaceholder}
              className="w-full"
              onChange={onSearchValueChange || (() => {})}
              onKeyDown={(event: KeyboardEvent) => {
                if (event.key === 'Escape') {
                  setIsSearchOpen(false);
                }
              }}
            />
          </div>
          <FlatButton
            icon="cancel"
            isCircular
            ariaLabel="Close search"
            onClick={() => setIsSearchOpen(false)}
          />
        </div>
      )}
      <div className="absolute bottom-0 left-0 w-full h-0.5 rounded-b-lg overflow-hidden z-20">
        <Syncing className="" isSyncing={isSyncing || isLoading} />
      </div>
    </div>
  );
};

export default ActionBar;
