import React, { Component } from 'react';
import SignupDialog from '../components/signupDialog';
import axios from 'axios';
import has from 'lodash/has';
import validator from 'validator';
import sanitizeUsername from '../helpers/sanitizeUsername';

class SignupDialogContainer extends Component {

  state = {
    username: '',
    email: '',
    hasError: false,
    error: '',
    isSigningUp: false
  }

  getIsValidNewUser = () => {
    const { username, email, error, hasError, isSigningUp } = this.state;
    let hasErrorMessage = false;
    let isSignupButtonDisabled = isSigningUp;
    let errorMessage = '';

    if (!validator.isEmail(email)) {
      hasErrorMessage = true;
      isSignupButtonDisabled = true;
      errorMessage = 'Email is not valid';
    }
    if (email.length === 0) {
      hasErrorMessage = true;
      isSignupButtonDisabled = true;
      errorMessage = 'Please enter your email';
    }
    if (username.length < 6) {
      hasErrorMessage = true;
      isSignupButtonDisabled = true;
      errorMessage = 'Username must be atleast 6 characters';
    }
    if (username.length === 0) {
      hasErrorMessage = true;
      isSignupButtonDisabled = true;
      errorMessage = 'Please enter a username';
    }
    if (hasError) {
      hasErrorMessage = true;
      errorMessage = error;
    }

    return {
      hasError: hasErrorMessage,
      error: errorMessage,
      isSignupButtonDisabled
    };
  }

  onSignupFormUpdate = ({ update }: { update: any }) => {
    if (has(update, 'username')) {
      update.username = sanitizeUsername(update.username);
    }
    update.hasError = false;
    update.error = '';
    this.setState(update);
  }

  onSignupButtonClicked = () => {
    const { hasError } = this.getIsValidNewUser();
    if (hasError) {
      return;
    }
    this.setState({ isSigningUp: true });
    const { username, email } = this.state;
    axios.post(`/api/signup`, { username, email }).then((response) => {
      const userId = response.data.user._id;
      window.location.href = `${window.location.href}/verify/${userId}?email=${encodeURIComponent(email)}`;
    }).catch((error) => {
      if (error.response?.data) {
        const { message } = error.response.data;
        this.setState({ error: message, hasError: true, isSigningUp: false });
      } else {
        this.setState({ error: 'Network error. Please try again.', hasError: true, isSigningUp: false });
      }
    });
  }

  render() {

    let { isSignupButtonDisabled, hasError, error } = this.getIsValidNewUser();

    return (
      <SignupDialog
        model={this.state}
        alertText={hasError ? error : 'Everything looks good!'}
        alertType={hasError ? 'warning' : 'info'}
        isSignupButtonDisabled={isSignupButtonDisabled}
        onSignupFormUpdate={this.onSignupFormUpdate}
        onSignupButtonClicked={this.onSignupButtonClicked}
      />
    );
  }
};

export default SignupDialogContainer;