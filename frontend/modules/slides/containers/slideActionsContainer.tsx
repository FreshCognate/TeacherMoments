import React, { Component } from 'react';
import SlideActions from '../components/slideActions';
import WithCache from '~/core/cache/containers/withCache';
import WithRouter from '~/core/app/components/withRouter';
import getDoesSlideContainPrompts from '../helpers/getDoesSlideContainPrompts';
import getCache from '~/core/cache/helpers/getCache';
import { Slide } from '../slides.types';
import addModal from '~/core/dialogs/helpers/addModal';
import EditSlideFeedbackContainer from './editSlideFeedbackContainer';
import addSidePanel from '~/core/dialogs/helpers/addSidePanel';


interface SlideActionsContainerProps {
  slide: {
    data: Slide,
    mutate: (
      update: Partial<Slide>,
      options: { method: string },
      callback: (status: string) => void
    ) => void
  }
  router: any
}

class SlideActionsContainer extends Component<SlideActionsContainerProps> {

  onToggleFeedbackClicked = (hasFeedback: boolean) => {
    this.props.slide.mutate({ hasFeedback }, { method: 'put' }, (status) => {
      if (status === 'MUTATED') {
        const slides = getCache('slides');
        if (slides.fetch) {
          slides.fetch();
        }
      }
    });
  }

  onEditFeedbackClicked = () => {
    addSidePanel({
      size: 'lg',
      icon: 'feedback',
      title: 'Slide feedback',
      component: <EditSlideFeedbackContainer />
    })
  }

  render() {

    if (!this.props.slide.data) return null;

    const doesSlideContainPrompts = getDoesSlideContainPrompts({ slide: this.props.slide.data });

    return (
      <SlideActions
        slide={this.props.slide.data}
        doesSlideContainPrompts={doesSlideContainPrompts}
        onToggleFeedbackClicked={this.onToggleFeedbackClicked}
        onEditFeedbackClicked={this.onEditFeedbackClicked}
      />
    );
  }
};

export default WithRouter(WithCache(SlideActionsContainer, {}, ['slide']));