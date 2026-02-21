import React from 'react';
import Landing from '../components/landing';
import openLoginModal from '~/modules/authentication/helpers/openLoginModal';

const LandingContainer = () => {
  return (
    <Landing onAuthClicked={openLoginModal} />
  );
};

export default LandingContainer;
