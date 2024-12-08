import React, { Component } from 'react';
import Navigation from '../components/navigation';
import WithCache from '~/core/cache/containers/withCache';

class NavigationContainer extends Component {
  render() {
    return (
      <Navigation
        authentication={this.props.authentication}
      />
    );
  }
};

export default WithCache(NavigationContainer, {
  app: {
    getInitialData: () => ({
      language: 'en-US'
    })
  }
});