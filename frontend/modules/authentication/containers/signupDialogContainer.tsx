import React, { Component } from 'react';
import SignupDialog from '../components/signupDialog';
import axios from 'axios';
import has from 'lodash/has';
import isEmail from 'validator/lib/isEmail';
import isStrongPassword from 'validator/lib/isStrongPassword';
import sanitizeUsername from '../helpers/sanitizeUsername';
import getPasswordStrength from '../helpers/getPasswordStrength';
import handleRequestError from '~/core/app/helpers/handleRequestError';

class SignupDialogContainer extends Component {

  state = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    hasError: false,
    error: ''
  }

  getIsValidNewUser = () => {
    const { username, email, password, confirmPassword } = this.state;
    let isSignupButtonDisabled = false;
    let error = '';

    const passwordStrengthData = getPasswordStrength(password);

    if (password !== confirmPassword) {
      isSignupButtonDisabled = true;
      error = 'Passwords do not match';
    }
    if (!isStrongPassword(password)) {
      isSignupButtonDisabled = true;
      error = 'Passwords is not strong enough';
    }
    if (!isEmail(email)) {
      isSignupButtonDisabled = true;
      error = 'Email is not valid';
    }
    if (username.length < 6) {
      isSignupButtonDisabled = true;
      error = 'Username must be atleast 6 characters';
    }

    return {
      hasError: isSignupButtonDisabled,
      error,
      isSignupButtonDisabled,
      passwordStrength: passwordStrengthData.strength,
      passwordAttributes: passwordStrengthData.attributes
    };
  }

  onSignupFormUpdate = ({ update }: { update: any }) => {
    if (has(update, 'username')) {
      update.username = sanitizeUsername(update.username);
    }
    this.setState(update);
  }

  onSignupButtonClicked = () => {
    const { hasError } = this.getIsValidNewUser();
    if (hasError) {
      return;
    }
    const { username, email, password, confirmPassword } = this.state;
    axios.post(`/api/signup`, { username, email, password, confirmPassword }).then((response) => {
      console.log(response);
    }).catch(handleRequestError);
  }

  render() {

    let { isSignupButtonDisabled, hasError, error, passwordAttributes, passwordStrength } = this.getIsValidNewUser();

    return (
      <SignupDialog
        model={this.state}
        alertText={hasError ? error : 'Everything looks good!'}
        alertType={hasError ? 'warning' : 'info'}
        passwordAttributes={passwordAttributes}
        passwordStrength={passwordStrength}
        isSignupButtonDisabled={isSignupButtonDisabled}
        onSignupFormUpdate={this.onSignupFormUpdate}
        onSignupButtonClicked={this.onSignupButtonClicked}
      />
    );
  }
};

export default SignupDialogContainer;