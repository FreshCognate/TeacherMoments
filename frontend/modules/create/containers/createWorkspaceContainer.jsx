import React, { Component } from 'react';
import CreateWorkspace from '../components/createWorkspace';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import find from 'lodash/find';

class CreateWorkspaceContainer extends Component {
  getActiveSlideRef = () => {
    const { slides, router } = this.props;

    const searchParams = new URLSearchParams(router.location.search);
    const slideId = searchParams.get('slide');

    const activeSlide = find(slides.data, { _id: slideId })

    if (activeSlide) {
      return activeSlide.ref;
    }

  }

  getActiveSlideId = () => {
    const searchParams = new URLSearchParams(this.props.router.location.search);
    return searchParams.get('slide');
  }

  render() {
    const { displayMode, navigationMode } = this.props.editor.data;
    const activeSlideRef = this.getActiveSlideRef();
    const activeSlideId = this.getActiveSlideId();
    const isStaticSlide = activeSlideId === 'CONSENT' || activeSlideId === 'SUMMARY';
    return (
      <CreateWorkspace
        activeSlideRef={activeSlideRef}
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