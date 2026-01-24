import React, { Component } from 'react';
import CreateWorkspaceToolbar from '../components/createWorkspaceToolbar';
import WithCache from '~/core/cache/containers/withCache';
import BlockSelectorContainer from '~/modules/blocks/containers/blockSelectorContainer';
import addModal from '~/core/dialogs/helpers/addModal';
import getCache from '~/core/cache/helpers/getCache';
import find from 'lodash/find';
import getUrlDetails from '../helpers/getUrlDetails';

class CreateWorkspaceToolbarContainer extends Component {
  onDisplayModeChanged = (displayMode) => {
    this.props.editor.set({ displayMode });
    if (displayMode === 'PREVIEW') {
      document.getElementById("scenario-builder").scrollTo({ top: 0, behaviour: 'instant' });
    }
  }

  onAddBlockClicked = () => {
    addModal({
      title: 'Choose a block type to add to your slide:',
      component: <BlockSelectorContainer />,
      actions: [{
        type: 'CANCEL',
        text: 'Cancel'
      }]
    })
  }

  onSlideNameChanged = (event) => {
    const update = { name: event.target.value }
    const slides = getCache('slides');
    slides.setStatus('syncing');
    slides.set(update, { setType: 'itemExtend', setFind: { _id: this.props.slide.data._id } })
    this.props.slide.mutate(update, { method: 'put' }, (status) => {
      if (status === 'MUTATED') {
        const slides = getCache('slides');
        slides.fetch();
      }
    });
  }

  render() {
    const { displayMode } = this.props.editor.data;
    const { selectedSlideId } = getUrlDetails();
    const isStaticSlide = selectedSlideId === 'CONSENT' || selectedSlideId === 'SUMMARY';
    return (
      <CreateWorkspaceToolbar
        slide={this.props.slide.data || {}}
        displayMode={displayMode}
        isStaticSlide={isStaticSlide}
        onDisplayModeChanged={this.onDisplayModeChanged}
        onAddBlockClicked={this.onAddBlockClicked}
        onSlideNameChanged={this.onSlideNameChanged}
      />
    );
  }
};

export default WithCache(CreateWorkspaceToolbarContainer, {
  slide: {
    url: '/api/slides/:id',
    getInitialData: ({ props }) => {
      const slides = getCache('slides');
      const currentSlide = find(slides.data, { ref: props.activeSlideRef });
      return currentSlide;
    },
    transform: ({ data }) => data.slide,
    getParams: ({ props }) => {
      const slides = getCache('slides');
      const currentSlide = find(slides.data, { ref: props.activeSlideRef });
      return {
        id: currentSlide?._id
      }
    },
    getDependencies: ({ props }) => {
      return [props.activeSlideRef]
    }
  }
}, ['editor']);