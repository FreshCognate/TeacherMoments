import React, { Component } from 'react';
import CohortScenarioContainer from '../containers/cohortScenarioContainer';

export const handle = { isFullWidth: true };

class CohortScenarioRoute extends Component {
  render() {
    return (
      <CohortScenarioContainer />
    );
  }
};

export default CohortScenarioRoute;