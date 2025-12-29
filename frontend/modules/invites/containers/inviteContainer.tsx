import React, { Component } from 'react';
import Invite from '../components/invite';
import WithRouter from '~/core/app/components/withRouter';
import axios from 'axios';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import get from 'lodash/get';
import addModal from '~/core/dialogs/helpers/addModal';
import LoginAndSignupDialogContainer from '~/modules/authentication/containers/loginAndSignupDialogContainer';

export type InviteContainerProps = {
  router: any,
}

class InviteContainer extends Component<InviteContainerProps> {

  componentDidMount(): void {
    const { params } = this.props.router;
    if (params.inviteId) {
      axios.post('/api/invites', { inviteId: params.inviteId }).then((response) => {
        const cohort = get(response, 'data.cohort');
        const user = get(response, 'data.user');
        if (cohort && user) {
          this.props.router.navigate(`/cohorts/${cohort._id}/overview`);
        } else {
          addModal({
            title: 'Login or create an account',
            body: 'Please choose one of the following options:',
            component: <LoginAndSignupDialogContainer />
          }, (state: string, payload: any) => {

            if (state === 'ACTION') {
              const { type } = payload;
              switch (type) {
                case 'LOGIN':
                  addModal({ title: 'Login' }, () => { });
                  break;
                case 'ANONYMOUSLY':
                  addModal({ title: 'Anonymously login' }, () => { });
                  break;
                case 'CREATE':
                  addModal({ title: 'Create an account' }, () => { });
                  break;
              }
            }
          })
        }
      }).catch(handleRequestError);
    }
  }

  render() {
    return (
      <Invite />
    );
  }
};

export default WithRouter(InviteContainer)