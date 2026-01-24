import React from 'react';
import addModal from '~/core/dialogs/helpers/addModal';
import getCache from '~/core/cache/helpers/getCache';
import LoginAndSignupDialogContainer from '../containers/loginAndSignupDialogContainer';
import LoginDialogContainer from '../containers/loginDialogContainer';
import SignupDialogContainer from '../containers/signupDialogContainer';

export default function openLoginModal() {
  const dialogsCache = getCache('dialogs');

  if (dialogsCache.data?.isModalOpen) {
    return;
  }

  addModal({
    title: 'Login or create an account',
    body: 'Please choose one of the following options:',
    component: <LoginAndSignupDialogContainer />
  }, (state: string, payload: any) => {
    if (state === 'ACTION') {
      const { type } = payload;
      switch (type) {
        case 'LOGIN':
          addModal({ title: 'Login', component: <LoginDialogContainer /> }, () => { });
          break;
        case 'CREATE':
          addModal({ title: 'Create an account', component: <SignupDialogContainer /> }, () => { });
          break;
      }
    }
  });
}
