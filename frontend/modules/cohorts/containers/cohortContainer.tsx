import React, { Component } from 'react';
import Cohort from '../components/cohort';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import { Cohort as CohortType } from '../cohorts.types';
import getIsEditor from '~/modules/authentication/helpers/getIsEditor';

interface CohortContainerProps {
  router: any,
  cohort: {
    data: CohortType,
    status: 'loading' | 'unresolved' | 'syncing'
  }
}

class CohortContainer extends Component<CohortContainerProps> {

  onToggleClicked = (value: string | number) => {
    const { navigate, params } = this.props.router;
    navigate(`/cohorts/${params.id}/${value}`, { viewTransition: true, replace: true });
  }

  render() {

    const pathValue = this.props.router.matches[this.props.router.matches.length - 1].id;
    console.log(pathValue);

    const { data, status } = this.props.cohort;

    return (
      <Cohort
        cohort={data}
        pathValue={pathValue}
        isLoading={status === 'loading' || status === 'unresolved'}
        isEditor={getIsEditor()}
        onToggleClicked={this.onToggleClicked}
      />
    );
  }
};

export default WithRouter(WithCache(CohortContainer, {
  cohort: {
    url: '/api/cohorts/:id',
    getParams: ({ props }: { props: CohortContainerProps }) => {
      return {
        id: props.router.params.id
      }
    },
    transform: ({ data }: { data: { cohort: CohortType } }) => data.cohort
  }
}));