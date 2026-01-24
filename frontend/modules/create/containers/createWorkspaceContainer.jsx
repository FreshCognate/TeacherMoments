import React, { Component } from 'react';
import CreateWorkspace from '../components/createWorkspace';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import getUrlDetails from '../../run/helpers/getUrlDetails';

class CreateWorkspaceContainer extends Component {

  render() {
    const { displayMode, navigationMode } = this.props.editor.data;
    const { selectedSlideId } = getUrlDetails();
    const isStaticSlide = selectedSlideId === 'CONSENT' || selectedSlideId === 'SUMMARY';
    return (
      <CreateWorkspace
        activeSlideId={selectedSlideId}
        displayMode={displayMode}
        navigationMode={navigationMode}
        isStaticSlide={isStaticSlide}
      />
    );
  }
};

export default WithRouter(WithCache(CreateWorkspaceContainer, {
  run: {
    getInitialData: () => {
      return {
        activeSlideRef: null,
        stages: []
      }
    }
  }
}, ['editor', 'slides', 'blocks']));