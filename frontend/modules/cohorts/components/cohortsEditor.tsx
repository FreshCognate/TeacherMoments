import React from 'react';
import { Link, Outlet } from 'react-router';
import Loading from '~/uikit/loaders/components/loading';
import truncate from 'lodash/truncate';
import NavigationToggle from '~/uikit/toggles/components/navigationToggle';
import { Cohort } from '../cohorts.types';

const CohortsEditor = ({
  cohort,
  pathValue,
  isLoading,
  onToggleClicked
}: {
  cohort: Cohort,
  pathValue: string,
  isLoading: boolean,
  onToggleClicked: (pathValue: string | number) => void
}) => {
  if (isLoading) return <Loading />
  return (
    <div>
      <div className="flex items-center fixed w-full top-14 z-30 justify-stretch px-4 h-7 bg-lm-0 dark:bg-dm-0 border-b border-b-lm-3 dark:border-b-dm-2">
        <div className="w-1/3 flex items-center">
          <div className="text-xs">
            <Link
              to="/cohorts"
              className="text-black/60 dark:text-white/60 hover:text-black/80 dark:hover:text-white/80 transition-colors"
            >
              Cohorts
            </Link>
            <span className="text-black/60 dark:text-white/60">{` > `}</span>
            <span

              className="text-black/60 dark:text-white/60"
            >
              {truncate(cohort?.name, { length: 60 })}
            </span>
          </div>
        </div>
        <div className="w-1/3 flex justify-center">
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
        <div className="w-1/3 flex justify-end text-sm">
          {/* <ScenarioSyncStatusContainer /> */}
        </div>
      </div>
      <main className="pt-7">
        <Outlet />
      </main>
    </div>
  );
};

export default CohortsEditor;