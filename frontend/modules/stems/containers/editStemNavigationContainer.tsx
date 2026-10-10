import React, { Component } from 'react';
import EditStemNavigation from '../components/editStemNavigation';
import WithCache from '~/core/cache/containers/withCache';
import WithRouter from '~/core/app/components/withRouter';
import { Stem } from '../stems.types';
import getCache from '~/core/cache/helpers/getCache';
import getEditStemNavigationSchema from '../schemas/getEditStemNavigationSchema';

interface EditStemNavigationContainerProps {
  stem: {
    data: Stem,
    mutate: (
      update: Partial<Stem>,
      options: { method: string, url?: string },
      callback: (status: string) => void
    ) => void
  }
}

class EditStemNavigationContainer extends Component<EditStemNavigationContainerProps> {

  onStemUpdate = ({ update }: { update: Partial<Stem> }) => {
    const { stem } = this.props;
    stem.mutate(update, {
      method: 'put'
    }, (status: string) => {
      if (status === 'MUTATED') {
        const stems = getCache('stems');
        if (stems.fetch) {
          stems.fetch();
        }
      }
    });
  }

  render() {
    const editStemNavigationSchema = getEditStemNavigationSchema({ stem: this.props.stem.data });
    return (
      <EditStemNavigation
        stem={this.props.stem.data}
        schema={editStemNavigationSchema}
        onStemUpdate={this.onStemUpdate}
      />
    );
  }
};

export default WithRouter(WithCache(EditStemNavigationContainer, {
  stem: {
    url: '/api/stems/:id',
    getInitialData: ({ props }: { props: any }) => {
      return props.stem;
    },
    transform: ({ data }: { data: { stem: Stem } }) => data.stem,
    getParams: ({ props }: { props: any }) => {

      return {
        id: props.stem?._id
      }
    }
  }
}));