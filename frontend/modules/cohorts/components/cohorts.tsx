import React from 'react';
import { Link } from 'react-router';
import { ActionBarProps } from '~/uikit/actionBars/actionBars.types';
import ActionBar from '~/uikit/actionBars/components/actionBar';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Card from '~/uikit/cards/components/card';
import CardActions from '~/uikit/cards/components/cardActions';
import CardContent from '~/uikit/cards/components/cardContent';
import Title from '~/uikit/content/components/title';
import map from 'lodash/map';
import truncate from 'lodash/truncate';
import { Cohort } from '../cohorts.types';

const Cohorts = ({
  cohorts,
  actions,
  searchValue,
  currentPage,
  totalPages,
  filter,
  filters,
  sortBy,
  sortByOptions,
  isSyncing,
  isLoading,
  isEditor,
  onSearchValueChange,
  onFiltersChanged,
  onPaginationClicked,
  onSortByChanged,
  onActionClicked,
  onDuplicateCohortClicked
}: ActionBarProps & {
  cohorts: Cohort[],
  isEditor: boolean,
  onDuplicateCohortClicked: (cohortId: string) => void
}) => {
  return (
    <div className="p-4">
      <div>
        <ActionBar
          actions={actions}
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
          onFiltersChanged={onFiltersChanged}
          onPaginationClicked={onPaginationClicked}
          onSortByChanged={onSortByChanged}
          onActionClicked={onActionClicked}
        />
      </div>
      <div className="grid grid-cols-4 gap-4 py-4">
        {map(cohorts, (cohort: Cohort) => {
          return (
            <Card key={cohort._id}>
              <CardContent>
                <Title title={truncate(cohort.name, { length: 60 })} />
              </CardContent>
              {(isEditor) && (
                <CardActions>
                  <Link to={`/cohorts/${cohort._id}/overview`}>
                    <FlatButton
                      icon="edit"
                      text="Edit"
                    />
                  </Link>
                  <FlatButton icon="copy" text="Copy" onClick={() => onDuplicateCohortClicked(cohort._id)} />
                </CardActions>
              )}
              {(!isEditor) && (
                <CardActions>
                  <Link to={`/cohorts/${cohort._id}/overview`}>
                    <FlatButton
                      icon="view"
                      text="View"
                    />
                  </Link>
                </CardActions>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Cohorts;