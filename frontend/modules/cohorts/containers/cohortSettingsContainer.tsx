import React, { Component } from 'react';
import CohortSettings from '../components/cohortSettings';
import WithCache from '~/core/cache/containers/withCache';
import WithRouter from '~/core/app/components/withRouter';
import editCohortSchema from '../schemas/editCohortSchema';
import addModal from '~/core/dialogs/helpers/addModal';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import axios from 'axios';

class CohortSettingsContainer extends Component<any> {

  onUpdateCohort = ({ update }: { update: any }) => {
    return this.props.cohort.mutate(update, { method: 'put' });
  }

  onDeleteCohortClicked = () => {
    addModal({
      title: 'Delete cohort',
      body: `Are you sure you would like to delete "${this.props.cohort.data.name}"?`,
      actions: [{
        type: 'CANCEL',
        text: 'Cancel'
      }, {
        type: 'DELETE',
        text: 'Delete',
        color: 'warning'
      }]
    }, (state: string, { type }: { type: string }) => {
      if (state === 'ACTION') {
        if (type === 'DELETE') {
          axios.delete(`/api/cohorts/${this.props.cohort.data._id}`).then(() => {
            this.props.router.navigate('/cohorts');
          }).catch(handleRequestError);
        }
      }
    });
  }

  render() {
    const { data, status } = this.props.cohort;
    return (
      <CohortSettings
        schema={editCohortSchema}
        cohort={data}
        isLoading={status === 'loading' || status === 'unresolved'}
        onUpdateCohort={this.onUpdateCohort}
        onDeleteCohortClicked={this.onDeleteCohortClicked}
      />
    );
  }
}

export default WithRouter(WithCache(CohortSettingsContainer, null, ['cohort']));
