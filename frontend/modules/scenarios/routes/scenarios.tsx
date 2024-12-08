import ScenariosContainer from '~/modules/scenarios/containers/scenariosContainer';

export function meta({ }) {
  return [
    { title: "TM" },
    { name: "description", content: "Welcome to TM!" },
  ];
}

export default function Scenarios() {
  return (
    <ScenariosContainer />
  );
}