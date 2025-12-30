import React, { Component } from 'react';
import SignupDialog from '../components/signupDialog';
import axios from 'axios';
import get from 'lodash/get';
import has from 'lodash/has';
import isEmail from 'validator/lib/isEmail';
import isStrongPassword from 'validator/lib/isStrongPassword';

class SignupDialogContainer extends Component {

  state = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    hasError: false,
    error: ''
  }

  sanitizeUsername = (username: string): string => {
    return username
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z-]/g, '');
  }

  getPasswordStrength = (password: string) => {
    let strength = 0;
    const attributes = {
      hasMinLength: password.length >= 8,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSymbol: /[^a-zA-Z0-9]/.test(password)
    };

    if (attributes.hasMinLength) strength++;
    if (attributes.hasLowercase) strength++;
    if (attributes.hasUppercase) strength++;
    if (attributes.hasNumber) strength++;
    if (attributes.hasSymbol) strength++;

    return {
      strength,
      attributes
    };
  }

  getIsSignupButtonDisabled = () => {
    const { username, email, password, confirmPassword } = this.state;
    let isSignupButtonDisabled = false;
    let error = '';

    const passwordStrengthData = this.getPasswordStrength(password);

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
      update.username = this.sanitizeUsername(update.username);
    }
    this.setState(update);
  }

  onSignupButtonClicked = () => {

  }

  render() {

    let { isSignupButtonDisabled, hasError, error, passwordAttributes, passwordStrength } = this.getIsSignupButtonDisabled();

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