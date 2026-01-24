import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router';
import PlayScenarioLoaderContainer from '../containers/playScenarioLoaderContainer';
import Loading from '~/uikit/loaders/components/loading';
import openLoginModal from '~/modules/authentication/helpers/openLoginModal';

type OutletContext = {
  loaderData: {
    isAuthenticated: boolean;
    authentication: any;
  };
};

export default function PlayScenarioRoute() {
  const { loaderData } = useOutletContext<OutletContext>();
  const isAuthenticated = loaderData?.isAuthenticated;

  useEffect(() => {
    if (!isAuthenticated) {
      openLoginModal();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Loading />;
  }

  return (
    <PlayScenarioLoaderContainer />
  );
}
