import React from 'react';
import { Link, Outlet } from 'react-router';
import NavigationToggle from '~/uikit/toggles/components/navigationToggle';
import Toggle from '~/uikit/toggles/components/toggle';
import ScenarioSyncStatusContainer from '../containers/scenarioSyncStatusContainer';
import Loading from '~/uikit/loaders/components/loading';

const ScenarioEditor = ({
  scenario,
  pathValue,
  isLoading,
  onToggleClicked
}) => {
  if (isLoading) return <Loading />
  return (
    <div>
      <div className="flex items-center sticky top-10 justify-stretch px-4 h-7 border-b border-b-lm-2 dark:border-b-dm-2 bg-lm-1 dark:bg-dm-1">
        <div className="w-1/3 flex items-center">
          <div className="text-xs">
            <Link to="/scenarios">
              Scenarios
            </Link>
            <span>{` > `}</span>
            <Link to={`/scenarios/${scenario._id}`}>
              {scenario.name}
            </Link>
          </div>
        </div>
        <div className="w-1/3 flex justify-center">

          <NavigationToggle
            value={pathValue}
            size="sm"
            options={[{
              value: 'create',
              text: 'Create'
            }, {
              value: 'share',
              text: 'Share'
            }, {
              value: 'results',
              text: 'Results'
            }, {
              value: 'settings',
              text: 'Settings'
            }]}
            onClick={onToggleClicked}
          />
        </div>
        <div className="w-1/3 flex justify-end text-sm">
          <ScenarioSyncStatusContainer />
        </div>
      </div>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default ScenarioEditor;