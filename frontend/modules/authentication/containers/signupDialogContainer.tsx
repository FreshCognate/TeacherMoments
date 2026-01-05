import React, { Component } from 'react';
import SignupDialog from '../components/signupDialog';
import axios from 'axios';
import has from 'lodash/has';
import validator from 'validator';
import sanitizeUsername from '../helpers/sanitizeUsername';
import getPasswordStrength from '../helpers/getPasswordStrength';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import addModal from '~/core/dialogs/helpers/addModal';
import VerifyCodeDialogContainer from './verifyCodeDialogContainer';

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
    const { username, email, password, confirmPassword, error, hasError } = this.state;
    let hasErrorMessage = false;
    let isSignupButtonDisabled = false;
    let errorMessage = '';

    const passwordStrengthData = getPasswordStrength(password);

    if (password !== confirmPassword) {
      hasErrorMessage = true;
      isSignupButtonDisabled = true;
      errorMessage = 'Passwords do not match';
    }
    if (!validator.isStrongPassword(password)) {
      hasErrorMessage = true;
      isSignupButtonDisabled = true;
      errorMessage = 'Passwords is not strong enough';
    }
    if (!validator.isEmail(email)) {
      hasErrorMessage = true;
      isSignupButtonDisabled = true;
      errorMessage = 'Email is not valid';
    }
    if (username.length < 6) {
      hasErrorMessage = true;
      isSignupButtonDisabled = true;
      errorMessage = 'Username must be atleast 6 characters';
    }
    if (hasError) {
      hasErrorMessage = true;
      errorMessage = error;
    }

    return {
      hasError: hasErrorMessage,
      error: errorMessage,
      isSignupButtonDisabled,
      passwordStrength: passwordStrengthData.strength,
      passwordAttributes: passwordStrengthData.attributes
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
    const { username, email, password, confirmPassword } = this.state;
    axios.post(`/api/signup`, { username, email, password, confirmPassword }).then((response) => {
      const userId = response.data.user._id;
      window.location.href = `${window.location.href}/verify/${userId}`;
    }).catch((error) => {
      const { statusCode, message } = error.response.data;
      if (statusCode === 400) {
        this.setState({ error: message, hasError: true })
      }
    });
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