import React, { Component } from 'react';
import CohortParticipantScenarios from '../components/cohortParticipantScenarios';
import WithCache from '~/core/cache/containers/withCache';
import WithRouter from '~/core/app/components/withRouter';
import { Scenario } from '~/modules/scenarios/scenarios.types';
import find from 'lodash/find';
import keyBy from 'lodash/keyBy';
import { Run } from '~/modules/run/runs.types';
import addModal from '~/core/dialogs/helpers/addModal';
import axios from 'axios';
import handleRequestError from '~/core/app/helpers/handleRequestError';

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
  cohortParticipantRuns: {
    data: any
  }
  router: any
}

class CohortParticipantScenariosContainer extends Component<CohortParticipantScenariosProps> {

  onPlayScenarioClicked = (scenarioId: string) => {
    const scenario = find(this.props.cohortParticipantScenarios.data, { _id: scenarioId });
    const run = this.props.cohortParticipantRuns.data[scenarioId];
    const playUrl = `/play/${scenario.publishLink}?cohort=${this.props.router.params.id}`;

    if (run && run.isComplete) {
      addModal({
        title: 'Scenario already completed',
        body: 'You have already completed this scenario. Would you like to continue your existing session or start a new one?',
        actions: [{
          type: 'CONTINUE',
          text: 'Continue session',
        }, {
          type: 'NEW',
          text: 'Start new session',
          color: 'primary'
        }]
      }, (state: string, { type }: { type: string }) => {
        if (state === 'ACTION') {
          if (type === 'CONTINUE') {
            this.props.router.navigate(playUrl);
          }
          if (type === 'NEW') {
            axios.put(`/api/play/runs/${scenarioId}`, { isArchived: true }).then(() => {
              this.props.router.navigate(playUrl);
            }).catch(handleRequestError);
          }
        }
      });
    } else {
      this.props.router.navigate(playUrl);
    }
  }

  onViewScenarioResponseClicked = (scenarioId: string) => {
    this.props.router.navigate(`/cohorts/${this.props.router.params.id}/scenarios/${scenarioId}`);
  }

  render() {
    const { data, status } = this.props.cohortParticipantScenarios;
    return (
      <CohortParticipantScenarios
        scenarios={data}
        runs={this.props.cohortParticipantRuns.data}
        onPlayScenarioClicked={this.onPlayScenarioClicked}
        onViewScenarioResponseClicked={this.onViewScenarioResponseClicked}
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
  cohortParticipantRuns: {
    url: '/api/play/runs',
    getInitialData: () => ({}),
    transform: ({ data }: { data: { runs: Run[] } }) => keyBy(data.runs, 'scenario'),
    getQuery: ({ props }: { props: CohortParticipantScenariosProps }) => {
      return {
        cohort: props.router.params.id
      }
    },
  }
}));