import React, { Component } from 'react';
import Login from '../components/login';
import axios from 'axios';
import handleRequestError from '~/core/app/helpers/handleRequestError';

class LoginContainer extends Component {

  state = {
    email: '',
    password: ''
  }

  onLoginFormUpdate = ({ update }) => {
    this.setState(update);
  }

  onLoginButtonClicked = () => {
    axios.post('/api/authentication', this.state).then(() => {
      window.location = '/';
    }).catch(handleRequestError);
  }

  render() {
    return (
      <Login
        model={this.state}
        onLoginFormUpdate={this.onLoginFormUpdate}
        onLoginButtonClicked={this.onLoginButtonClicked}
      />
    );
  }
};

export default LoginContainer;