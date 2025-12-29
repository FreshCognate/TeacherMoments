import React, { Component } from 'react';
import LoginDialog from '../components/loginDialog';
import axios from 'axios';
import get from 'lodash/get';

class LoginDialogContainer extends Component {

  state = {
    email: '',
    password: '',
    hasError: false,
    error: ''
  }

  onLoginFormUpdate = ({ update }) => {
    this.setState(update);
  }

  onLoginButtonClicked = () => {
    this.setState({
      hasError: false,
      error: ''
    });
    axios.post('/api/authentication', { email: this.state.email, password: this.state.password }).then(() => {
      window.location.reload();
    }).catch((error) => {
      this.setState({
        hasError: true,
        error: get(error, 'response.data.message', '')
      })
    });
  }

  render() {
    return (
      <LoginDialog
        model={this.state}
        hasError={this.state.hasError}
        error={this.state.error}
        onLoginFormUpdate={this.onLoginFormUpdate}
        onLoginButtonClicked={this.onLoginButtonClicked}
      />
    );
  }
};

export default LoginDialogContainer;