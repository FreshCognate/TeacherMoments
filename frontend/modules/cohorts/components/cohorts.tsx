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
  sortBy,
  sortByOptions,
  isSyncing,
  isLoading,
  onSearchValueChange,
  onPaginationClicked,
  onSortByChanged,
  onActionClicked,
  onDuplicateCohortClicked
}: ActionBarProps & {
  cohorts: Cohort[],
  onDuplicateCohortClicked: (cohortId: string) => void
}) => {
  return (
    <div>
      <div className="bg-lm-0 dark:bg-dm-0 px-4 border-b border-b-lm-3 dark:border-b-dm-2">
        <ActionBar
          actions={actions}
          searchValue={searchValue}
          searchPlaceholder="Search cohorts..."
          currentPage={currentPage}
          totalPages={totalPages}
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
          onSortByChanged={onSortByChanged}
          onActionClicked={onActionClicked}
        />
      </div>
      <div className="grid grid-cols-4 gap-4 p-4">
        {map(cohorts, (cohort: Cohort) => {
          return (
            <Card key={cohort._id}>
              <CardContent>
                <Title title={truncate(cohort.name, { length: 60 })} />
              </CardContent>
              <CardActions>
                <Link to={`/cohorts/${cohort._id}/create`}>
                  <FlatButton
                    icon="edit"
                    text="Edit"
                  />
                </Link>
                <FlatButton icon="copy" text="Copy" onClick={() => onDuplicateCohortClicked(cohort._id)} />
              </CardActions>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Cohorts;