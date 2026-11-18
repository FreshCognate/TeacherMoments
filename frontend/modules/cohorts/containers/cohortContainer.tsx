import React, { Component } from 'react';
import Cohort from '../components/cohort';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import { Cohort as CohortType } from '../cohorts.types';
import canUserEditCohort from '~/modules/authentication/helpers/canUserEditCohort';

interface CohortContainerProps {
  router: any,
  cohort: {
    data: CohortType,
    status: 'unresolved' | 'idle' | 'loading' | 'syncing' | 'error' | 'success',
    response?: { status?: number }
  }
}

class CohortContainer extends Component<CohortContainerProps> {

  onToggleClicked = (value: string | number) => {
    const { navigate, params } = this.props.router;
    navigate(`/cohorts/${params.id}/${value}`, { viewTransition: true, replace: true });
  }

  render() {

    const pathValue = this.props.router.matches[this.props.router.matches.length - 1].id;

    const { data, status, response } = this.props.cohort;

    const responseStatus = response?.status;
    const hasLoadedCohort = data?._id === this.props.router.params.id;
    const hasNoAccess = status === 'error'
      && !hasLoadedCohort
      && (responseStatus === 401 || responseStatus === 404);

    return (
      <Cohort
        cohort={data}
        pathValue={pathValue}
        isLoading={status === 'loading' || status === 'unresolved'}
        hasNoAccess={hasNoAccess}
        isEditor={canUserEditCohort(data)}
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