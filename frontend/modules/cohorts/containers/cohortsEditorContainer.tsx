import React, { Component } from 'react';
import CohortsEditor from '../components/cohortsEditor';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import { Cohort } from '../cohorts.types';

interface CohortEditorContainerProps {
  router: any,
  cohort: {
    data: Cohort,
    status: 'loading' | 'unresolved' | 'syncing'
  }
}

class CohortsEditorContainer extends Component<CohortEditorContainerProps> {

  onToggleClicked = (value: string | number) => {
    const { navigate, params } = this.props.router;
    navigate(`/cohorts/${params.id}/${value}`, { viewTransition: true, replace: true });
  }

  render() {

    const pathValue = this.props.router.matches[this.props.router.matches.length - 1].id;

    const { data, status } = this.props.cohort;

    return (
      <CohortsEditor
        cohort={data}
        pathValue={pathValue}
        isLoading={status === 'loading' || status === 'unresolved'}
        onToggleClicked={this.onToggleClicked}
      />
    );
  }
};

export default WithRouter(WithCache(CohortsEditorContainer, {
  cohort: {
    url: '/api/cohorts/:id',
    getParams: ({ props }: { props: CohortEditorContainerProps }) => {
      return {
        id: props.router.params.id
      }
    },
    transform: ({ data }: { data: { cohort: Cohort } }) => data.cohort
  }
}));