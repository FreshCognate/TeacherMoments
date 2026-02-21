import { useOutletContext } from 'react-router';
import DashboardContainer from '../containers/dashboardContainer';
import LandingContainer from '~/modules/landing/containers/landingContainer';

type OutletContext = {
  loaderData: {
    isAuthenticated: boolean;
    authentication: any;
  };
};

export function meta({ }) {
  return [
    { title: "Teacher Moments" },
    { name: "description", content: "Preparing teachers for challenging situations through digital simulations" },
  ];
}

export default function HomeRoute() {
  const { loaderData } = useOutletContext<OutletContext>();
  const isAuthenticated = loaderData?.isAuthenticated;

  if (!isAuthenticated) {
    return <LandingContainer />;
  }

  return <DashboardContainer />;
}
