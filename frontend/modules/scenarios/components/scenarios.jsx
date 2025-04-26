import React from 'react';
import Button from '~/uikit/buttons/components/button';
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

const Scenarios = ({
  scenarios,
  searchValue,
  currentPage,
  totalPages,
  filter,
  filters,
  sortBy,
  sortByOptions,
  isSyncing,
  isLoading,
  onCreateScenarioClicked,
  onSearchValueChange,
  onPaginationClicked,
  onFiltersChanged,
  onSortByChanged,
  onDuplicateScenarioClicked
}) => {
  return (
    <div className="flex h-full">
      <div className="min-w-60 p-4 bg-lm-1 dark:bg-dm-2/50 border-r border-lm-2 dark:border-dm-2" style={{ height: 'calc(100vh - 40px)' }}>
        <Button text="Create scenario" color="primary" isFullWidth onClick={onCreateScenarioClicked} />
      </div>
      <div className="flex-1">
        <div className="bg-lm-1 dark:bg-dm-1 px-4">
          <ActionBar
            searchValue={searchValue}
            searchPlaceholder="Search scenarios..."
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
        </div>
        <div className="grid grid-cols-4 gap-4 p-4">
          {map(scenarios, (scenario) => {
            return (
              <Card key={scenario._id}>
                <CardContent>
                  <Title title={truncate(scenario.name, { length: 60 })} />
                </CardContent>
                <CardActions>
                  <Link to={`/scenarios/${scenario._id}/create`}>
                    <FlatButton
                      icon="edit"
                      text="Edit"
                    />
                  </Link>
                  <FlatButton icon="copy" text="Copy" onClick={() => onDuplicateScenarioClicked(scenario._id)} />
                </CardActions>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Scenarios;