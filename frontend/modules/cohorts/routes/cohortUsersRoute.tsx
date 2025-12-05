import React, { Component } from 'react';
import CohortUsersContainer from '../containers/cohortUsersContainer';
import WithCache from '~/core/cache/containers/withCache';

class CohortUsersRoute extends Component {
  render() {
    return (
      <CohortUsersContainer />
    );
  }
};

export default CohortUsersRoute;