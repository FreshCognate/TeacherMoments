import React, { Component } from 'react';
import getIsScenarioValid from '~/modules/scenarios/helpers/getIsScenarioValid';
import ValidationIndicator from '~/uikit/badges/components/validationIndicator';

class ScenarioValidationContainer extends Component {

  render() {
    return (
      <ValidationIndicator errors={getIsScenarioValid()} />
    );
  }
};

export default ScenarioValidationContainer;