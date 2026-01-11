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

  onVerifyFormUpdate = ({ update }: { update: any }) => {
    this.setState({
      ...update,
      hasError: false,
      error: ''
    });
  }

  onVerifyButtonClicked = () => {
    const { userId } = this.props.router.params;
    if (!this.state.code || this.state.isVerifying || !userId) {
      return;
    }

    this.setState({
      hasError: false,
      error: '',
      isVerifying: true
    });

    axios.put(`/api/signup/${this.props.router.params.userId}`, { code: this.state.code })
      .then((response) => {
        const { params } = this.props.router;
        if (params.inviteId) {
          window.location.href = `${window.location.origin}/invite/${params.inviteId}`;
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