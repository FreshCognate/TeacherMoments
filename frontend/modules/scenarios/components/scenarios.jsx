import React from 'react';
import Button from '~/uikit/buttons/components/button';
import map from 'lodash/map';
import { Link } from 'react-router';
import ActionBar from '~/uikit/actionBars/components/actionBar';
import Card from '~/uikit/cards/components/card';

const Scenarios = ({
  scenarios,
  searchValue,
  currentPage,
  totalPages,
  isSyncing,
  isLoading,
  onCreateScenarioClicked,
  onSearchValueChange,
  onPaginationClicked
}) => {
  return (
    <div className="flex h-full">
      <div className="min-w-60 p-4 bg-lm-1 dark:bg-dm-1 border-r border-lm-2 dark:border-dm-2" style={{ height: 'calc(100vh - 40px)' }}>
        <Button text="Create scenario" color="primary" isFullWidth onClick={onCreateScenarioClicked} />
      </div>
      <div className="flex-1">
        <div className="border-b border-b-lm-2 dark:border-b-dm-2">
          <ActionBar
            searchValue={searchValue}
            currentPage={currentPage}
            totalPages={totalPages}
            hasSearch
            hasPagination
            isSyncing={isSyncing}
            isLoading={isLoading}
            shouldAutoFocus
            onSearchValueChange={onSearchValueChange}
            onPaginationClicked={onPaginationClicked}
          />
        </div>
        <div className="grid grid-cols-4 gap-4 p-4">
          {map(scenarios, (scenario) => {
            return (
              <Link key={scenario._id} to={`/scenarios/${scenario._id}/create`}>
                <Card name={scenario.name} title={scenario.title} description={scenario.description}>

                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Scenarios;