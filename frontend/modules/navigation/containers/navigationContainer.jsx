import React, { Component } from 'react';
import Navigation from '../components/navigation';
import WithCache from '~/core/cache/containers/withCache';
import connectSockets from '~/core/sockets/helpers/connectSockets';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import axios from 'axios';
import disconnectSockets from '~/core/sockets/helpers/disconnectSockets';
import LoginDialogContainer from '~/modules/authentication/containers/loginDialogContainer';
import addModal from '~/core/dialogs/helpers/addModal';

class NavigationContainer extends Component {

  state = { isLoggingOut: false }

  componentDidMount = () => {
    connectSockets();
  }

  componentWillUnmount = () => {
    disconnectSockets();
  }

  onLoginClicked = () => {
    addModal({
      title: 'Login',
      component: <LoginDialogContainer />
    })
  }

  onLogoutClicked = () => {
    disconnectSockets();
    this.setState({ isLoggingOut: true });
    axios.delete('/api/authentication').then(() => {
      window.location = '/';
    }).catch(handleRequestError);
  }

  render() {
    return (
      <Navigation
        authentication={this.props.authentication.data}
        isLoggingOut={this.state.isLoggingOut}
        onLoginClicked={this.onLoginClicked}
        onLogoutClicked={this.onLogoutClicked}
      />
    );
  }
};

export default WithCache(NavigationContainer, {
  app: {
    getInitialData: () => ({
      language: 'en-US'
    })
  },
  authentication: {
    getInitialData: ({ props }) => {
      return props.loaderData.authentication;
    }
  }
});