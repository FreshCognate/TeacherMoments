import React, { Component } from 'react';
import Invite from '../components/invite';
import WithRouter from '~/core/app/components/withRouter';
import axios from 'axios';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import get from 'lodash/get';
import addModal from '~/core/dialogs/helpers/addModal';
import LoginAndSignupDialogContainer from '~/modules/authentication/containers/loginAndSignupDialogContainer';
import LoginDialogContainer from '~/modules/authentication/containers/loginDialogContainer';
import SignupDialogContainer from '~/modules/authentication/containers/signupDialogContainer';

export type InviteContainerProps = {
  router: any,
}

interface InviteContainerState {
  isInviteNotFound: boolean;
  isInviteCheckFailed: boolean;
}

class InviteContainer extends Component<InviteContainerProps, InviteContainerState> {

  state: InviteContainerState = {
    isInviteNotFound: false,
    isInviteCheckFailed: false
  }

  componentDidMount(): void {
    const { params } = this.props.router;
    if (params.inviteId) {
      axios.post('/api/invites', { inviteId: params.inviteId }).then((response) => {

        const cohort = get(response, 'data.cohort');
        const user = get(response, 'data.user');

        if (cohort && user) {
          this.props.router.navigate(`/cohorts/${cohort._id}/overview`);
        } else if (!cohort) {
          this.setState({ isInviteNotFound: true });
        } else {

          addModal({
            title: 'Log in or create an account',
            body: "There's no password: we email you a code each time you log in.",
            component: <LoginAndSignupDialogContainer />
          }, (state: string, payload: any) => {

            if (state === 'ACTION') {
              const { type } = payload;
              switch (type) {
                case 'LOGIN':
                  addModal({ title: 'Log in', component: <LoginDialogContainer /> }, () => { });
                  break;
                case 'CREATE':
                  addModal({ title: 'Create an account', component: <SignupDialogContainer /> }, () => { });
                  break;
              }
            }
          })
        }
      }, (error) => {
        this.setState({ isInviteCheckFailed: true });
        return handleRequestError(error);
      }).catch(handleRequestError);
    }
  }

  render() {
    return (
      <Invite
        isInviteNotFound={this.state.isInviteNotFound}
        isInviteCheckFailed={this.state.isInviteCheckFailed}
      />
    );
  }
};

export default WithRouter(InviteContainer)