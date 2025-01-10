import React from 'react';
import CreateScenarioContainer from '../containers/createScenarioContainer';
import ScenarionBuilderContainer from '../containers/scenarionBuilderContainer';

export default function CreateScenarioRoute({ matches }: { matches: any[] }) {
  const currentMatch = matches[matches.length - 1];
  if (currentMatch.id === 'create') {
    return <ScenarionBuilderContainer />
  }
  return (
    <CreateScenarioContainer />
  );
}