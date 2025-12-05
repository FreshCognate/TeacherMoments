import React, { Component } from 'react';
import CohortUsers from '../components/cohortUsers';
import WithCache from '~/core/cache/containers/withCache';
import find from 'lodash/find';
import { Cohort } from '../cohorts.types';

export type CohortUsersContainerProps = {
  cohort: {
    data: Cohort
  }
}

class CohortUsersContainer extends Component<CohortUsersContainerProps> {

  getActiveInvite = () => {
    return find(this.props.cohort.data.invites, { isActive: true });
  }

  render() {
    return (
      <CohortUsers
        cohortId={this.props.cohort.data._id}
        activeInvite={this.getActiveInvite()}
      />
    );
  }
};

export default WithCache(CohortUsersContainer, {}, ['cohort']);