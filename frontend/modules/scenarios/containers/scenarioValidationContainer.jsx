import React, { Component } from 'react';
import getScenarioErrors from '~/modules/scenarios/helpers/getScenarioErrors';
import ValidationIndicator from '~/uikit/badges/components/validationIndicator';

class ScenarioValidationContainer extends Component {

  render() {
    return (
      <ValidationIndicator errors={getScenarioErrors()} />
    );
  }
};

export default ScenarioValidationContainer;