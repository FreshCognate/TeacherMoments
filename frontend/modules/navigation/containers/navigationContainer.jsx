import React, { Component } from 'react';
import Navigation from '../components/navigation';
import WithCache from '~/core/cache/containers/withCache';
import connectSockets from '~/core/sockets/helpers/connectSockets';

class NavigationContainer extends Component {

  componentDidMount = () => {
    connectSockets();
  }

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