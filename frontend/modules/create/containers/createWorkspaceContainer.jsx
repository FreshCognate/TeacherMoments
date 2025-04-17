import React, { Component } from 'react';
import CreateWorkspace from '../components/createWorkspace';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import find from 'lodash/find';
import sortBy from 'lodash/sortBy';
import filter from 'lodash/filter';

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
    const { displayMode } = this.props.editor.data;
    const activeSlideRef = this.getActiveSlideRef();
    return (
      <CreateWorkspace
        activeSlideRef={activeSlideRef}
        activeSlideId={this.getActiveSlideId()}
        displayMode={displayMode}
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