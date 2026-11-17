import React from 'react';
import { Link } from 'react-router';
import { ActionBarProps } from '~/uikit/actionBars/actionBars.types';
import ActionBar from '~/uikit/actionBars/components/actionBar';
import Card from '~/uikit/cards/components/card';
import CardContent from '~/uikit/cards/components/cardContent';
import Title from '~/uikit/content/components/title';
import Body from '~/uikit/content/components/body';
import getString from '~/modules/ls/helpers/getString';
import map from 'lodash/map';
import size from 'lodash/size';
import truncate from 'lodash/truncate';
import getDateString from '~/core/app/helpers/getDateString';
import { Cohort } from '../cohorts.types';
import canUserEditCohort from '~/modules/authentication/helpers/canUserEditCohort';
import Instructions from '~/uikit/alerts/components/instructions';
import CollectionEmpty from '~/uikit/collections/components/collectionEmpty';

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
}: ActionBarProps & {
  cohorts: Cohort[],
  isEditor: boolean
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
      {(cohorts.length === 0 && !isLoading && isEditor) && (
        <div>
          <Instructions
            title="Welcome to Cohort Management"
            instructions={[{
              body: "In Teacher Moments, a cohort is how you manage groups of participants. It connects them to the scenarios they need to practice."
            }, {
              body: "To manage a class effectively, you will use three main features:",
            }, {
              title: "👥 Cohorts:",
              body: "Think of these as your classes or sections. You create a cohort to group participants together (e.g., 'Fall Semester 2026' or 'Workshop A')."
            }, {
              title: "📚 Scenarios:",
              body: "Once a cohort is created, you add scenarios to it. They appear on the cohort's page for everyone in the group."
            }, {
              title: "📊 View Responses:",
              body: "As participants finish scenarios, their responses show up in the cohort. You can monitor participation and review individual responses to track progress."
            }]}
          />
          <CollectionEmpty
            attributes={{
              title: "You haven't created any cohorts yet.",
              body: "Click Create cohort to organize your participants into a class and start assigning work."
            }}
          />
        </div>
      )}
      {(cohorts.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
          {map(cohorts, (cohort: Cohort) => {
            const isCohortEditor = canUserEditCohort(cohort);
            return (
              <Link to={`/cohorts/${cohort._id}/overview`} className="h-full">
                <Card key={cohort._id}>
                  <CardContent>
                    <Title title={truncate(cohort.name, { length: 60 })} />
                    <Body body={getString({ model: cohort, field: 'description' })} />
                    {isCohortEditor && (
                      <div className="flex flex-col gap-1 mt-2 text-xs text-gray-500">
                        {cohort.createdAt && (
                          <span>Created {getDateString(cohort.createdAt)}</span>
                        )}
                        {cohort.updatedAt && (
                          <span>Last edited {getDateString(cohort.updatedAt)}</span>
                        )}
                        {cohort.collaborators && (
                          <span>{size(cohort.collaborators)} {size(cohort.collaborators) === 1 ? 'collaborator' : 'collaborators'}</span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Cohorts;