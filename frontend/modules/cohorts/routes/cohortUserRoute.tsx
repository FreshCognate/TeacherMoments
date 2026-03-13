import React, { Component } from 'react';
import CohortUserContainer from '../containers/cohortUserContainer';

export const handle = { isFullWidth: true };

class CohortUserRoute extends Component {
  render() {
    return (
      <CohortUserContainer />
    );
  }
};

export default CohortUserRoute;