import React, { Component } from 'react';
import Invite from '../components/invite';
import WithRouter from '~/core/app/components/withRouter';
import axios from 'axios';
import handleRequestError from '~/core/app/helpers/handleRequestError';

export type InviteContainerProps = {
  router: any,
}

class InviteContainer extends Component<InviteContainerProps> {

  componentDidMount(): void {
    const { params } = this.props.router;
    if (params.inviteId) {
      axios.post('/api/invites', { inviteId: params.inviteId }).then(() => {

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