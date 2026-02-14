import React, { Component } from 'react';
import CohortUsers from '../components/cohortUsers';
import WithCache from '~/core/cache/containers/withCache';
import find from 'lodash/find';
import { Cohort } from '../cohorts.types';
import axios from 'axios';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import addModal from '~/core/dialogs/helpers/addModal';
import WithRouter from '~/core/app/components/withRouter';
import { User } from '~/modules/users/users.types';
import getUserDisplayName from '~/modules/users/helpers/getUserDisplayName';
import debounce from 'lodash/debounce';

export type CohortUsersContainerProps = {
  cohort: {
    data: Cohort,
    fetch: any
  }
  router: any,
  cohortUsers: any
}

class CohortUsersContainer extends Component<CohortUsersContainerProps> {

  state = {
    isCreatingInviteLink: false
  }

  getActiveInvite = () => {
    return find(this.props.cohort.data.invites, { isActive: true });
  }

  getItemAttributes = (item: User) => {
    return {
      id: item._id,
      name: getUserDisplayName(item),
      meta: []
    }
  }

  getItemActions = () => {
    return [
      { action: 'REMOVE', text: 'Remove' }
    ]
  }

  getEmptyAttributes = () => {
    return {
      title: 'No users in this cohort',
      body: 'Share the invite link above to add users to this cohort.',
    }
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

  debounceFetch = debounce((fetch) => fetch(), 1000)

  onSearchValueChange = (searchValue: string) => {
    this.props.cohortUsers.setStatus('syncing');
    this.props.cohortUsers.setQuery({ searchValue, currentPage: 1 });
    this.debounceFetch(this.props.cohortUsers.fetch);
  }

  onPaginationClicked = (action: string) => {
    const { setStatus, setQuery, fetch, query } = this.props.cohortUsers;
    setStatus('syncing');
    let currentPage = query.currentPage;
    if (action === 'up') {
      currentPage++;
    } else {
      currentPage--;
    }
    setQuery({ currentPage });
    fetch();
  }

  onItemActionClicked = ({ itemId, action }: { itemId: string, action: string }) => {
    if (action === 'REMOVE') {
      addModal({
        title: 'Remove user',
        body: 'Are you sure you would like to remove this user from the cohort?',
        actions: [{
          type: 'CANCEL',
          text: 'Cancel'
        }, {
          type: 'REMOVE',
          text: 'Remove',
          color: 'warning'
        }]
      }, (state: string, { type }: { type: string }) => {
        if (state === 'ACTION' && type === 'REMOVE') {
          axios.delete(`/api/cohorts/users/${itemId}`).then(() => {
            this.props.cohortUsers.fetch();
          }).catch(handleRequestError);
        }
      });
    }
  }


  render() {
    const { cohortUsers } = this.props;
    return (
      <CohortUsers
        users={cohortUsers.data}
        cohortId={this.props.cohort.data._id}
        activeInvite={this.getActiveInvite()}
        searchValue={cohortUsers.query.searchValue}
        currentPage={cohortUsers.query.currentPage}
        totalPages={cohortUsers.response?.totalPages || 1}
        isCreatingInviteLink={this.state.isCreatingInviteLink}
        isLoading={cohortUsers.status === 'loading' || cohortUsers.status === 'unresolved'}
        isSyncing={cohortUsers.status === 'syncing'}
        getItemAttributes={this.getItemAttributes}
        getItemActions={this.getItemActions}
        getEmptyAttributes={this.getEmptyAttributes}
        onCreateInviteLinkClicked={this.onCreateInviteLinkClicked}
        onSearchValueChange={this.onSearchValueChange}
        onPaginationClicked={this.onPaginationClicked}
        onItemActionClicked={this.onItemActionClicked}

      />
    );
  }
};

export default WithRouter(WithCache(CohortUsersContainer, {
  cohortUsers: {
    url: '/api/cohortUsers',
    transform: ({ data }: { data: { users: User[] } }) => data.users,
    getQuery: ({ props }: { props: CohortUsersContainerProps }) => {
      return {
        cohortId: props.router.params.id
      }
    },
  },
}, ['cohort']));