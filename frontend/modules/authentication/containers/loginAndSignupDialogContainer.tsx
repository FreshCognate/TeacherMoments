import React, { Component } from 'react';
import LoginAndSignupDialog from '../components/loginAndSignupDialog';

class LoginAndSignupDialogContainer extends Component<any> {

  onProcessClicked = (process: string) => {
    this.props.actions.onActionClicked(process);
  }

  render() {
    return (
      <LoginAndSignupDialog
        onProcessClicked={this.onProcessClicked}
      />
    );
  }
};

export default LoginAndSignupDialogContainer;