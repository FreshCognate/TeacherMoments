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
    title: 'Log in or create an account',
    body: "There's no password: we email you a code each time you log in.",
    component: <LoginAndSignupDialogContainer />,
    hasCloseButton: true
  }, (state: string, payload: any) => {
    if (state === 'ACTION') {
      const { type } = payload;
      switch (type) {
        case 'LOGIN':
          addModal({ title: 'Log in', component: <LoginDialogContainer />, hasCloseButton: true }, () => { });
          break;
        case 'CREATE':
          addModal({ title: 'Create an account', component: <SignupDialogContainer />, hasCloseButton: true }, () => { });
          break;
      }
    }
  });
}
