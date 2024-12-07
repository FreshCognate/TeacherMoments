import React, { Component } from 'react';
import Login from '../components/login';
import axios from 'axios';

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
    })
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