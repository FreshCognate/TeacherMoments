import React, { Component } from 'react';
import CohortOverview from '../components/cohortOverview';
import WithCache from '~/core/cache/containers/withCache';
import WithRouter from '~/core/app/components/withRouter';
import triggerExport from '~/modules/analytics/helpers/triggerExport';
import find from 'lodash/find';
import { Cohort } from '../cohorts.types';

export type CohortOverviewContainerProps = {
  cohort: {
    data: Cohort
  }
}

class CohortOverviewContainer extends Component<CohortOverviewContainerProps> {

  getActiveInvite = () => {
    return find(this.props.cohort.data.invites, { isActive: true });
  }

  onExportClicked = () => {
    const { router } = this.props as any;
    triggerExport({ exportType: 'COHORT_ALL', cohortId: router.params.id });
  }

  render() {
    return (
      <CohortOverview
        cohort={this.props.cohort.data}
        onExportClicked={this.onExportClicked}
      />
    );
  }
};

export default WithRouter(WithCache(CohortOverviewContainer, {}, ['cohort']));