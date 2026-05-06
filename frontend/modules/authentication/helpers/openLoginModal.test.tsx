import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../containers/loginAndSignupDialogContainer', () => ({
  default: () => <div>login-signup-stub</div>
}));
vi.mock('../containers/loginDialogContainer', () => ({
  default: () => <div>login-stub</div>
}));
vi.mock('../containers/signupDialogContainer', () => ({
  default: () => <div>signup-stub</div>
}));

import openLoginModal from './openLoginModal';
import { createCache, resetCache, getCache } from '~/core/cache/helpers/cacheManager';

const seedDialogs = (data: any = {}) => {
  resetCache('dialogs');
  resetCache('modal');
  resetCache('dialogProgressItems');
  createCache({
    key: 'dialogs',
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
  createCache({
    key: 'modal',
    cache: { getInitialData: () => ({}) },
    container: { props: {} }
  });
  createCache({
    key: 'dialogProgressItems',
    cache: { getInitialData: () => [] },
    container: { props: {} }
  });
};

describe('openLoginModal', () => {
  beforeEach(() => {
    seedDialogs();
  });

  it('opens a modal by setting isModalOpen on the dialogs cache', () => {
    openLoginModal();
    expect(getCache('dialogs')!.data.isModalOpen).toBe(true);
  });

  it('does nothing when a modal is already open', () => {
    seedDialogs({ isModalOpen: true });

    openLoginModal();
    const modal = getCache('dialogs')!.data.modal;
    expect(modal).toBeUndefined();
  });
});
