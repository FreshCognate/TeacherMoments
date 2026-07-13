import React from 'react';
import map from 'lodash/map';
import { Link } from 'react-router';
import ActionBar from '~/uikit/actionBars/components/actionBar';
import Card from '~/uikit/cards/components/card';
import Title from '~/uikit/content/components/title';
import Body from '~/uikit/content/components/body';
import CardContent from '~/uikit/cards/components/cardContent';
import CardActions from '~/uikit/cards/components/cardActions';
import FlatButton from '~/uikit/buttons/components/flatButton';
import truncate from 'lodash/truncate';
import size from 'lodash/size';
import getString from '~/modules/ls/helpers/getString';
import getDateString from '~/core/app/helpers/getDateString';
import CollectionEmpty from '~/uikit/collections/components/collectionEmpty';

const Scenarios = ({
  scenarios,
  searchValue,
  currentPage,
  totalPages,
  actions,
  filter,
  filters,
  sortBy,
  sortByOptions,
  isSyncing,
  isLoading,
  isEditor,
  onSearchValueChange,
  onPaginationClicked,
  onFiltersChanged,
  onSortByChanged,
  onActionClicked,
  onDuplicateScenarioClicked
}) => {
  return (
    <div className="p-4">
      <div className="">
        <div className="">
          <ActionBar
            searchValue={searchValue}
            searchPlaceholder="Search scenarios..."
            currentPage={currentPage}
            totalPages={totalPages}
            filter={filter}
            filters={filters}
            actions={actions}
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
            onActionClicked={onActionClicked}
          />
        </div>
        {(scenarios.length === 0 && !isLoading && isEditor) && (
          <div className="py-4">
            <CollectionEmpty
              attributes={{
                title: "You haven't created any Scenarios yet.",
                body: "Click 'Create Scenario' to start building your first Scenario."
              }}
            />
          </div>
        )}
        {(scenarios.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
            {map(scenarios, (scenario) => {
              return (
                <Card key={scenario._id}>
                  <Link to={`/scenarios/${scenario._id}/create`} className="h-full">
                    <CardContent>
                      <Title title={truncate(scenario.name, { length: 60 })} className="text-lg mb-1" />
                      <Body body={truncate(getString({ model: scenario, field: 'description' }), { length: 120 })} className="text-sm text-gray-800 dark:text-gray-400" />
                      <div className="flex flex-col gap-1 mt-2 text-xs text-gray-500">
                        {scenario.createdAt && (
                          <span>Created {getDateString(scenario.createdAt)}</span>
                        )}
                        {scenario.updatedAt && (
                          <span>Last edited {getDateString(scenario.updatedAt)}</span>
                        )}
                        {scenario.collaborators && (
                          <span>{size(scenario.collaborators)} {size(scenario.collaborators) === 1 ? 'collaborator' : 'collaborators'}</span>
                        )}
                      </div>
                    </CardContent>
                  </Link>
                  <CardActions>
                    <div className="ml-auto">
                      <FlatButton
                        icon="copy"
                        text="Copy"
                        onClick={() => onDuplicateScenarioClicked(scenario._id)}
                      />
                    </div>
                  </CardActions>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Scenarios;