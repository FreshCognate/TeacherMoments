import React, { Component } from 'react';
import CohortOverview from '../components/cohortOverview';
import WithCache from '~/core/cache/containers/withCache';
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

  render() {
    return (
      <CohortOverview
        cohort={this.props.cohort.data}
      />
    );
  }
};

export default WithCache(CohortOverviewContainer, {}, ['cohort']);