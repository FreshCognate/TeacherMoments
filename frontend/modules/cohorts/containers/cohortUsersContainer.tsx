import React, { Component } from 'react';
import CohortUsers from '../components/cohortUsers';
import WithCache from '~/core/cache/containers/withCache';
import find from 'lodash/find';
import { Cohort } from '../cohorts.types';
import axios from 'axios';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import WithRouter from '~/core/app/components/withRouter';

export type CohortUsersContainerProps = {
  cohort: {
    data: Cohort,
    fetch: any
  }
}

class CohortUsersContainer extends Component<CohortUsersContainerProps> {

  state = {
    isCreatingInviteLink: false
  }

  getActiveInvite = () => {
    return find(this.props.cohort.data.invites, { isActive: true });
  }

  onCreateInviteLinkClicked = () => {

    this.setState({
      isCreatingInviteLink: true
    });

    axios.put(`/api/cohorts/${this.props.cohort.data._id}`, { intent: "CREATE_INVITE" }).then(() => {
      this.props.cohort.fetch().then(() => {
        this.setState({ isCreatingInviteLink: false });
      }).catch((error: any) => {
        this.setState({ isCreatingInviteLink: false });
        handleRequestError(error);
      })
    })
  }

  render() {
    return (
      <CohortUsers
        cohortId={this.props.cohort.data._id}
        activeInvite={this.getActiveInvite()}
        isCreatingInviteLink={this.state.isCreatingInviteLink}
        onCreateInviteLinkClicked={this.onCreateInviteLinkClicked}
      />
    );
  }
};

export default WithRouter(WithCache(CohortUsersContainer, {}, ['cohort']));