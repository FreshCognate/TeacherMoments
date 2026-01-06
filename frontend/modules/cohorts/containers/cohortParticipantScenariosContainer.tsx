import React, { Component } from 'react';
import CohortParticipantScenarios from '../components/cohortParticipantScenarios';
import WithCache from '~/core/cache/containers/withCache';
import WithRouter from '~/core/app/components/withRouter';
import { Scenario } from '~/modules/scenarios/scenarios.types';
import find from 'lodash/find';

interface CohortParticipantScenariosProps {
  cohortParticipantScenarios: {
    data: any,
    status: string,
    query: any,
    response: any,
    fetch: any,
    setQuery: any,
    setStatus: any
  }
  router: any
}

class CohortParticipantScenariosContainer extends Component<CohortParticipantScenariosProps> {

  onPlayScenarioClicked = (scenarioId: string) => {
    const scenario = find(this.props.cohortParticipantScenarios.data, { _id: scenarioId });
    this.props.router.navigate(`/play/${scenario.publishLink}?cohort=${this.props.router.params.id}`);
  }

  render() {
    const { data, status } = this.props.cohortParticipantScenarios;
    return (
      <CohortParticipantScenarios
        scenarios={data}
        onPlayScenarioClicked={this.onPlayScenarioClicked}
      />
    );
  }
};

export default WithRouter(WithCache(CohortParticipantScenariosContainer, {
  cohortParticipantScenarios: {
    url: '/api/cohortScenarios',
    transform: ({ data }: { data: { scenarios: Scenario[] } }) => data.scenarios,
    getQuery: ({ props }: { props: CohortParticipantScenariosProps }) => {
      return {
        cohortId: props.router.params.id
      }
    },
  },
}));