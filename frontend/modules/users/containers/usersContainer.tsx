import React, { Component } from 'react';
import Users from '../components/users';
import WithCache from '~/core/cache/containers/withCache';
import { User } from '../users.types';
import getUserDisplayName from '../helpers/getUserDisplayName';
import addModal from '~/core/dialogs/helpers/addModal';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import axios from 'axios';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import find from 'lodash/find';
import pick from 'lodash/pick';

interface UsersContainerProps {
  users: any
}

const roleOptions = [
  { value: 'ADMIN', text: 'Admin' },
  { value: 'FACILITATOR', text: 'Facilitator' },
  { value: 'RESEARCHER', text: 'Researcher' },
  { value: 'PARTICIPANT', text: 'Participant' }
];

class UsersContainer extends Component<UsersContainerProps> {

  debounceFetch = debounce((fetch: () => void) => {
    fetch();
  }, 800)

  getItemAttributes = (item: User) => {
    return {
      id: item._id,
      name: getUserDisplayName(item),
      meta: [
        { name: 'Email', value: item.email },
        { name: 'Role', value: item.role }
      ]
    };
  }

  getItemActions = () => {
    return [
      { action: 'EDIT', text: 'Edit', icon: 'edit' }
    ];
  }

  getEmptyAttributes = () => {
    return {
      title: 'No users found',
      body: 'Try adjusting your search.'
    };
  }

  onItemActionClicked = ({ itemId, action }: { itemId: string, action: string }) => {
    if (action === 'EDIT') {
      this.onEditUserClicked(itemId);
    }
  }

  onEditUserClicked = (userId: string) => {
    const user = find(this.props.users.data, { _id: userId });
    if (!user) return;

    addModal({
      title: 'Edit user',
      schema: {
        role: {
          type: 'Select',
          label: 'Role',
          options: roleOptions
        },
        email: {
          type: 'Text',
          label: 'Email'
        }
      },
      model: pick(user, ['role', 'email']),
      actions: [{
        type: 'CANCEL',
        text: 'Cancel'
      }, {
        type: 'SAVE',
        text: 'Save',
        color: 'primary'
      }]
    }, (state: string, { type, modal }: any) => {
      if (state === 'ACTION' && type === 'SAVE') {
        const update = pick(modal, ['role', 'email']);
        const hasEmailChanged = update.email !== user.email;

        if (hasEmailChanged) {
          addModal({
            title: 'Confirm email change',
            body: `Are you sure you want to change the email for ${getUserDisplayName(user)}?`,
            actions: [{
              type: 'CANCEL',
              text: 'Cancel'
            }, {
              type: 'CONFIRM',
              text: 'Confirm',
              color: 'primary'
            }]
          }, (confirmState: string, { type: confirmType }: any) => {
            if (confirmState === 'ACTION' && confirmType === 'CONFIRM') {
              this.saveUser(userId, update);
            }
          });
        } else {
          this.saveUser(userId, update);
        }
      }
    });
  }

  saveUser = (userId: string, update: any) => {
    axios.put(`/api/users/${userId}`, update).then(() => {
      this.props.users.fetch();
    }).catch(handleRequestError);
  }

  onSearchValueChange = (searchValue: string) => {
    const { users } = this.props;
    users.setStatus('syncing');
    users.setQuery({ searchValue, currentPage: 1 });
    this.debounceFetch(users.fetch);
  }

  onPaginationClicked = (direction: string) => {
    const { users } = this.props;
    users.setStatus('syncing');
    if (direction === 'up') {
      users.setQuery({ currentPage: users.query.currentPage + 1 });
    } else {
      users.setQuery({ currentPage: users.query.currentPage - 1 });
    }
    this.debounceFetch(users.fetch);
  }

  render() {
    const { query, status, data } = this.props.users;
    const { searchValue, currentPage } = query;
    const totalPages = get(this.props, 'users.response.totalPages', 1);
    const isSyncing = status === 'syncing';
    const isLoading = status === 'loading' || status === 'unresolved';

    return (
      <Users
        users={data}
        searchValue={searchValue}
        currentPage={currentPage}
        totalPages={totalPages}
        isLoading={isLoading}
        isSyncing={isSyncing}
        getItemAttributes={this.getItemAttributes}
        getItemActions={this.getItemActions}
        getEmptyAttributes={this.getEmptyAttributes}
        onSearchValueChange={this.onSearchValueChange}
        onPaginationClicked={this.onPaginationClicked}
        onItemActionClicked={this.onItemActionClicked}
      />
    );
  }
}

export default WithCache(UsersContainer, {
  users: {
    url: '/api/users',
    transform: ({ data }: { data: any }) => data.users,
    getInitialData: () => ([]),
    getQuery: () => ({
      searchValue: '',
      currentPage: 1
    })
  }
});
