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
  actions,
  filter,
  filters,
  sortBy,
  sortByOptions,
  isSyncing,
  isLoading,
  onSearchValueChange,
  onPaginationClicked,
  onFiltersChanged,
  onSortByChanged,
  onDuplicateScenarioClicked,
  onActionClicked
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
        {(scenarios.length === 0 && !isLoading) && (
          <>
            {/* <Instructions
              title="Welcome to Scenario Management"
              instructions={[{
                body: "In Teacher Moments, a Cohort is how you manage groups of learners. It acts as the bridge between your students and the scenarios they need to practice."
              }, {
                body: "To manage a class effectively, you will use three main features:",
              }, {
                title: "👥 Cohorts:",
                body: "Think of these as your classes or sections. You create a cohort to group students together (e.g., 'Fall Semester 2026' or 'Workshop A')."
              }, {
                title: "📚 Scenarios:",
                body: "Once a cohort is created, you add Scenarios to it. This grants the students in that group access to specific practice simulations."
              }, {
                title: "📊 View Responses:",
                body: "As students complete scenarios, their data flows back here. You can monitor participation and review individual responses to track progress."
              }]}
            /> */}
            <CollectionEmpty
              attributes={{
                title: "You haven't created any Scenarios yet.",
                body: "Click + Create Scenario to start building your first Scenario."
              }}
            />
          </>
        )}
        {(scenarios.length > 0) && (
          <div className="grid grid-cols-4 gap-4 py-4">
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
        )}
      </div>
    </div>
  );
};

export default Scenarios;