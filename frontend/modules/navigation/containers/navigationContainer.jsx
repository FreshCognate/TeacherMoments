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

  state = { isLoggingOut: false, isUserMenuOpen: false }

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

  onUserMenuToggle = (isOpen) => {
    this.setState({ isUserMenuOpen: isOpen });
  }

  onUserMenuOptionClicked = (action) => {
    this.setState({ isUserMenuOpen: false });
    if (action === 'logout') {
      this.onLogoutClicked();
    }
  }

  render() {
    return (
      <Navigation
        authentication={this.props.authentication.data}
        isLoggingOut={this.state.isLoggingOut}
        isUserMenuOpen={this.state.isUserMenuOpen}
        onLoginClicked={this.onLoginClicked}
        onUserMenuToggle={this.onUserMenuToggle}
        onUserMenuOptionClicked={this.onUserMenuOptionClicked}
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