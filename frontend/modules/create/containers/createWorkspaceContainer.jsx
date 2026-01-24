import React, { Component } from 'react';
import CreateWorkspace from '../components/createWorkspace';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import getScenarioDetails from '../../run/helpers/getScenarioDetails';

class CreateWorkspaceContainer extends Component {

  render() {
    const { displayMode, navigationMode } = this.props.editor.data;
    const { activeSlideId } = getScenarioDetails();
    const isStaticSlide = activeSlideId === 'CONSENT' || activeSlideId === 'SUMMARY';
    return (
      <CreateWorkspace
        activeSlideId={activeSlideId}
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