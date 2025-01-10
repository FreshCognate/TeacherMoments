import React, { Component } from 'react';
import ScenarioBuilderItem from '../components/scenarioBuilderItem';

class ScenarioBuilderItemContainer extends Component {
  render() {
    return (
      <ScenarioBuilderItem
        slide={this.props.slide}
      />
    );
  }
};

export default ScenarioBuilderItemContainer;