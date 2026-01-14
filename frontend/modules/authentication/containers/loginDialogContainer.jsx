import React, { Component } from 'react';
import LoginDialog from '../components/loginDialog';
import axios from 'axios';
import get from 'lodash/get';
import addModal from '~/core/dialogs/helpers/addModal';
import VerifyCodeDialogContainer from './verifyCodeDialogContainer';

class LoginDialogContainer extends Component {

  state = {
    email: '',
    hasError: false,
    error: ''
  }

  onLoginFormUpdate = ({ update }) => {
    this.setState(update);
  }

  onLoginButtonClicked = (turnstileToken) => {
    this.setState({
      hasError: false,
      error: ''
    });
    axios.post('/api/authentication', {
      email: this.state.email,
      turnstileToken
    }).then(() => {
      addModal({
        component: <VerifyCodeDialogContainer verifyType="LOGIN" email={this.state.email} />
      }, () => {

      })
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