import React from 'react';
import { Link, Outlet } from 'react-router';
import Loading from '~/uikit/loaders/components/loading';
import truncate from 'lodash/truncate';
import NavigationToggle from '~/uikit/toggles/components/navigationToggle';
import { Cohort as CohortType } from '../cohorts.types';
import CohortBreadcrumbContainer from '../containers/cohortBreadcrumbContainer';

const Cohort = ({
  cohort,
  pathValue,
  isLoading,
  isEditor,
  onToggleClicked
}: {
  cohort: CohortType,
  pathValue: string,
  isLoading: boolean,
  isEditor: boolean,
  onToggleClicked: (pathValue: string | number) => void
}) => {
  if (isLoading) return <Loading />
  return (
    <div className="p-4">
      <div className="sticky top-14 z-30">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 px-4 py-3 bg-lm-0 dark:bg-dm-1 border border-lm-3 dark:border-dm-1 rounded-lg">
          <div className="flex-1 flex justify-center sm:justify-start items-center">
            <CohortBreadcrumbContainer />
          </div>
          {(isEditor) && (
            <div className="flex-1 flex justify-center items-center">
              <NavigationToggle
                value={pathValue}
                size="sm"
                options={[{
                  value: 'overview',
                  text: 'Overview'
                }, {
                  value: 'users',
                  text: 'Users'
                }, {
                  value: 'scenarios',
                  text: 'Scenarios'
                }, {
                  value: 'settings',
                  text: 'Settings'
                }]}
                onClick={onToggleClicked}
              />
            </div>
          )}
          <div className="flex-1 flex justify-center sm:justify-end items-center text-sm">
            {/* <ScenarioSyncStatusContainer /> */}
          </div>
        </div>
      </div>
      <main className="pt-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Cohort;