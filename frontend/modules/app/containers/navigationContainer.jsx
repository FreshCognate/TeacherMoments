import React, { Component } from 'react';
import Navigation from '../components/navigation';

class NavigationContainer extends Component {
  render() {
    console.log(this.props.authentication);
    return (
      <Navigation
        authentication={this.props.authentication}
      />
    );
  }
};

export default NavigationContainer;