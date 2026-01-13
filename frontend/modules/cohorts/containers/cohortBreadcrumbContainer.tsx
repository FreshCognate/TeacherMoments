import React, { Component } from 'react';
import CohortBreadcrumb from '../components/cohortBreadcrumb';
import WithCache from '~/core/cache/containers/withCache';
import WithRouter from '~/core/app/components/withRouter';
import { Cohort } from '../cohorts.types';

export type CohortBreadcrumbContainerProps = {
  cohort: {
    data: Cohort
  }
  router: any
}

class CohortBreadcrumbContainer extends Component<CohortBreadcrumbContainerProps> {
  render() {
    console.log(this.props.router);
    const routeId = this.props.router.matches[2]?.id;
    console.log(routeId);
    return (
      <CohortBreadcrumb
        cohort={this.props.cohort.data}
        routeId={routeId}
      />
    );
  }
};

export default WithRouter(WithCache(CohortBreadcrumbContainer, {}, ['cohort']));