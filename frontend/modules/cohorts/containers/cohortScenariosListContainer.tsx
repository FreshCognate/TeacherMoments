import React, { Component } from 'react';
import CohortScenariosList from '../components/cohortScenariosList';
import WithCache from '~/core/cache/containers/withCache';
import axios from 'axios';
import getCache from '~/core/cache/helpers/getCache';
import WithRouter from '~/core/app/components/withRouter';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import find from 'lodash/find';
import each from 'lodash/each';
import map from 'lodash/map';
import handleRequestError from '~/core/app/helpers/handleRequestError';

interface CohortScenariosListContainerProps {
  cohortScenarios: any,
  router: any
}

class CohortScenariosListContainer extends Component<CohortScenariosListContainerProps> {

  onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    const activeScenario = find(this.props.cohortScenarios.data, { _id: active.id });
    const overScenario = find(this.props.cohortScenarios.data, { _id: over.id });

    const activeScenarioCohortObject = find(activeScenario.cohorts, { cohort: this.props.router.params.id });

    const activeScenarioSortOrder = activeScenarioCohortObject.sortOrder;

    const overScenarioCohortObject = find(overScenario.cohorts, { cohort: this.props.router.params.id });

    const overScenarioSortOrder = overScenarioCohortObject.sortOrder;

    const sortedCohortScenarios = arrayMove(this.props.cohortScenarios.data, activeScenarioSortOrder, overScenarioSortOrder);

    each(sortedCohortScenarios, (sortedCohortScenario: any, index) => {

      const scenarioCohortObject = find(sortedCohortScenario.cohorts, { cohort: this.props.router.params.id });

      scenarioCohortObject.sortOrder = index;

    });

    this.props.cohortScenarios.set(sortedCohortScenarios);

    axios.post(`/api/cohortScenarios`, {
      cohortId: this.props.router.params.id,
      scenarios: map(getCache('cohortScenarios').data, (scenario) => {
        const scenarioCohortObject = find(scenario.cohorts, { cohort: this.props.router.params.id });
        return {
          _id: scenario._id,
          sortOrder: scenarioCohortObject.sortOrder
        }
      })
    }).then(() => {
      this.props.cohortScenarios.fetch();
    }).catch(handleRequestError);

  }

  onRemoveScenarioClicked = (scenarioId: string) => {
    this.props.cohortScenarios.setStatus('syncing');
    axios.put(`/api/cohorts/${this.props.router.params.id}`, {
      scenarioId,
      intent: 'REMOVE'
    }).then(() => {
      // @ts-ignore
      getCache('availableScenarios').fetch();
      this.props.cohortScenarios.fetch();
    });
  }

  render() {
    return (
      <CohortScenariosList
        scenarios={this.props.cohortScenarios.data}
        isSyncing={this.props.cohortScenarios.status === 'syncing'}
        onDragEnd={this.onDragEnd}
        onRemoveScenarioClicked={this.onRemoveScenarioClicked}
      />
    );
  }
};

export default WithRouter(WithCache(CohortScenariosListContainer, {}, ['cohortScenarios']));