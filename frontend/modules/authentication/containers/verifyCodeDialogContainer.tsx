import React, { Component } from 'react';
import VerifyCodeDialog from '../components/verifyCodeDialog';
import axios from 'axios';
import get from 'lodash/get';
import WithRouter from '~/core/app/components/withRouter';

interface VerifyCodeDialogContainerState {
  code: string;
  hasError: boolean;
  error: string;
  isVerifying: boolean;
}

class VerifyCodeDialogContainer extends Component<any, VerifyCodeDialogContainerState> {

  state: VerifyCodeDialogContainerState = {
    code: '',
    hasError: false,
    error: '',
    isVerifying: false
  }

  loginUser = () => {
    axios.put(`/api/authentication`, { email: this.props.email, otpCode: this.state.code })
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        const message = get(error, 'response.data.message', 'Verification failed. Please try again.');
        this.setState({
          hasError: true,
          error: message,
          isVerifying: false
        });
      });
  }

  signupUser = () => {
    const { userId, inviteId } = this.props.router.params;
    const searchParams = new URLSearchParams(this.props.router.location.search);
    const email = searchParams.get('email');
    console.log(email);
    if (!userId || !email) {
      window.location.href = '/';
      return;
    };
    axios.put(`/api/signup/${userId}`, { email: email, otpCode: this.state.code })
      .then((response) => {
        if (inviteId) {
          window.location.href = `${window.location.origin}/invite/${inviteId}`;
        }
      })
      .catch((error) => {
        const message = get(error, 'response.data.message', 'Verification failed. Please try again.');
        this.setState({
          hasError: true,
          error: message,
          isVerifying: false
        });
      });
  }

  onVerifyFormUpdate = ({ update }: { update: any }) => {
    this.setState({
      ...update,
      hasError: false,
      error: ''
    });
  }

  onVerifyButtonClicked = () => {
    if (!this.state.code || this.state.isVerifying) {
      return;
    }

    this.setState({
      hasError: false,
      error: '',
      isVerifying: true
    });

    if (this.props.verifyType === 'LOGIN') {
      return this.loginUser();
    } else {
      return this.signupUser();
    }

  }

  render() {
    return (
      <VerifyCodeDialog
        model={{ code: this.state.code }}
        hasError={this.state.hasError}
        error={this.state.error}
        isVerifying={this.state.isVerifying}
        onVerifyFormUpdate={this.onVerifyFormUpdate}
        onVerifyButtonClicked={this.onVerifyButtonClicked}
      />
    );
  }
};

export default WithRouter(VerifyCodeDialogContainer);