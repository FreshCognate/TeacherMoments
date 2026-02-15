import truncate from 'lodash/truncate';
import React from 'react';
import { Link } from 'react-router';
import { Cohort } from '../cohorts.types';

const CohortBreadcrumb = ({
  cohort,
  routeId
}: { cohort: Cohort, routeId: string }) => {
  return (
    <div className="text-xs">
      <Link
        to="/cohorts"
        className="text-black/60 dark:text-white/60 hover:text-black/80 dark:hover:text-white/80 transition-colors"
      >
        Cohorts
      </Link>

      <span className="text-black/60 dark:text-white/60">{` > `}</span>
      {(routeId === 'overview') && (
        <span className="text-black/60 dark:text-white/60">
          {truncate(cohort?.name, { length: 60 })}
        </span>
      )}
      {(routeId === 'users' || routeId === 'scenarios' || routeId === 'settings' || routeId === 'scenario' || routeId === 'user') && (
        <>
          <Link
            to={`/cohorts/${cohort._id}/overview`}
            className="text-black/60 dark:text-white/60 hover:text-black/80 dark:hover:text-white/80 transition-colors"
          >
            {truncate(cohort?.name, { length: 60 })}
          </Link>
          <span className="text-black/60 dark:text-white/60">{` > `}</span>
        </>
      )}
      {(routeId === 'users') && (
        <span className="text-black/60 dark:text-white/60">
          Users
        </span>
      )}
      {(routeId === 'scenarios') && (
        <span className="text-black/60 dark:text-white/60">
          Scenarios
        </span>
      )}
      {(routeId === 'scenario') && (
        <span className="text-black/60 dark:text-white/60">
          Responses
        </span>
      )}
      {(routeId === 'user') && (
        <>
          <Link
            to={`/cohorts/${cohort._id}/users`}
            className="text-black/60 dark:text-white/60 hover:text-black/80 dark:hover:text-white/80 transition-colors"
          >
            Users
          </Link>
          <span className="text-black/60 dark:text-white/60">{` > `}</span>
          <span className="text-black/60 dark:text-white/60">
            Responses
          </span>
        </>
      )}
      {(routeId === 'settings') && (
        <span className="text-black/60 dark:text-white/60">
          Settings
        </span>
      )}
    </div >
  );
};

export default CohortBreadcrumb;